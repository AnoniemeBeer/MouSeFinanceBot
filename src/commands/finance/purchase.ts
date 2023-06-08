import { ApplicationCommandOptionType } from 'discord.js';
import { User, Purchase } from '../../model';
import { PurchaseRepository, UserRepository } from '../../repository';

export default {
    name: 'aankoop',
    description: 'Registreer een aankoop',
    devOnly: true,
    testOnly: true,
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
        },
        {
            name: 'persoon',
            description: "De persoon die de aankoop heeft gedaan",
            type: ApplicationCommandOptionType.User,
        },
    ],
    // deleted: Boolean,
    
    callback: async (client:any , interaction:any) => {
        const purchaseRepository = new PurchaseRepository(Purchase);
        const userRepository = new UserRepository(User);
        const price = interaction.options.getNumber('prijs');
        const description = interaction.options.getString('beschrijving');
        let user = interaction.options.getUser('persoon');

        if (user == null){
            user = interaction.member.user;
        }
        
        let userResult: User = await userRepository.getByDiscordId(user.id);

        // Check if the user exists, if not, create it
        // Otherwise, check if the user's name has changed
        if (userResult == null){
            const newUser = new User({
                id: null,
                name: user.username,
                discordId: user.id,
            });

            userResult = await userRepository.add(newUser);
        } else {
            // First check if the user's name has changed
            if (userResult.name != user.username){
                userResult.name = user.username;
                userResult = await userRepository.update(userResult.id?userResult.id:1, userResult);
            }
        }

        const purchase: Purchase = new Purchase({
            id: null,
            description: description,
            price: price,
            userId: userResult.id,
        });

        const purchaseResult = await purchaseRepository.add(purchase);

        userRepository.disconnect();

        interaction.reply(
            {
                content: `Moet nog geimplementeerd worden`,
                ephemeral: true,
            }
        );
    }
}