import { ApplicationCommandOptionType } from 'discord.js';
import { User, Purchase } from '../../entity';
import { AppDataSource } from '../../data-source';

export default {
    name: 'aankoop',
    description: 'Registreer een aankoop',
    devOnly: false,
    testOnly: false,
    options: [
        {
            name: 'prijs',
            description: "De prijs van de aankoop",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'beschrijving',
            description: "Wat was de aankoop",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'persoon',
            description: "De persoon die de aankoop heeft gedaan",
            type: ApplicationCommandOptionType.User,
        },
    ],
    // deleted: Boolean,
    
    callback: async (client:any , interaction:any) => {
        const purchaseRepository = AppDataSource.getRepository(Purchase);
        const userRepository = AppDataSource.getRepository(User);
        const price = interaction.options.getNumber('prijs');
        const description = interaction.options.getString('beschrijving');
        let user = interaction.options.getUser('persoon');

        if (user == null){
            user = interaction.user;
        }
        
        let userResult: User|null = await userRepository.findOne({where: {discordId: user.id}})

        // Check if the user exists, if not, create it
        // Otherwise, check if the user's name has changed
        if (userResult == null){
            const newUser = new User();
            newUser.discordId = user.id;
            newUser.name = user.username;

            await userRepository.save(newUser);

            userResult = await userRepository.findOne({where: {discordId: user.id}})

        } else {
            // First check if the user's name has changed
            if (userResult.name != user.username){
                userResult.name = user.username;
                userResult.discordId = user.id;
                await userRepository.save(userResult);
            }
        }

        if (userResult){
            const purchase: Purchase = new Purchase();
            purchase.description = description;
            purchase.price = price;
            purchase.user = userResult;
            const purchaseResult = await purchaseRepository.save(purchase);
            interaction.reply(
                {
                    content: `Aankoop van \`${description}\` geregistreerd voor \`${userResult.name}\`, prijs: \`€${price}\``,
                }
            );
            return;
        }

        interaction.reply({ content: 'Er ging iets mis, aankoop niet geregistreerd', ephemeral: true });
    }
}