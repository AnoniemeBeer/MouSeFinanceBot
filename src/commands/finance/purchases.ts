import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { User, Purchase } from '../../entity';
import { AppDataSource } from '../../data-source';

export default {
    name: 'aankopen',
    description: 'Krijg alle aankopen van een persoon te zien',
    devOnly: false,
    testOnly: false,
    options: [
        {
            name: 'persoon',
            description: "De persoon waarvan je de aankopen wilt zien",
            type: ApplicationCommandOptionType.User,
        },
    ],
    // deleted: Boolean,
    
    callback: async (client:any , interaction:any) => {
        const purchaseRepository = AppDataSource.getRepository(Purchase);
        const userRepository = AppDataSource.getRepository(User);
        const person: User = interaction.options.getUser('persoon');

        let user: any = null;

        if (person == null){
            user = await userRepository.findOne({where: {discordId: interaction.user.id}, relations: ['purchases']});
        }else{
            user = await userRepository.findOne({where: {discordId: `${person.id}`}, relations: ['purchases']});
        }

        if (user == null || user.purchases.length == 0){
            interaction.reply({ content: 'Deze persoon heeft nog geen aankopen gedaan', ephemeral: true });
            return;
        }

        let ids: string = ``;
        let beschrijvingen: string = ``;
        let prices: string = ``;
        let total: number = 0;
        
        let userPurchases: Purchase[] = user.purchases.slice(0, 10);

        for (const item of user.purchases) {
            total += item.price;
        }

        for (const item of userPurchases) {
            ids += `\`${item.id}\`\n`;
            beschrijvingen += `${item.description}\n`;
            prices += `${item.price}\n`;
        }

        const embed = new EmbedBuilder();
        embed.setTitle('Aankopen');
        embed.setDescription(`Dit zijn de laatste 10 aankopen van ${user.name} \nTotaal uitgegeven: ${total}`);
        embed.setColor('#53fc0b');

        embed.addFields(
            { name: 'Beschrijving', value: beschrijvingen, inline: true },
            { name: 'Prijs', value: prices, inline: true },
        )

        interaction.reply({ embeds: [embed]})
    }
}