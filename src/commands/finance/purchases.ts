import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { User, Purchase } from '../../entity';
import { AppDataSource } from '../../data-source';

export default {
    name: 'aankopen',
    description: 'Krijgt alle aankopen van een persoon te zien',
    devOnly: true,
    testOnly: true,
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
            user = await userRepository.findOne({where: {discordId: person.discordId}, relations: ['purchases']});
        }

        if (user == null || user.purchases.length == 0){
            interaction.reply({ content: 'Deze persoon heeft nog geen aankopen gedaan', ephemeral: true });
            return;
        }

        let ids: string = ``;
        let beschrijvingen: string = ``;
        let prices: string = ``;

        for (const item of user.purchases) {
            ids += `\`${item.id}\`\n`;
            beschrijvingen += `${item.description}\n`;
            prices += `${item.price}\n`;
        }

        const embed = new EmbedBuilder();
        embed.setTitle('Aankopen');
        embed.setDescription('Dit is het leaderboard van de server');
        embed.setColor('#53fc0b');

        embed.addFields(
            { name: 'Id', value: ids, inline: true },
            { name: 'Beschrijving', value: beschrijvingen, inline: true },
            { name: 'Prijs', value: prices, inline: true },
        )

        interaction.reply({ embeds: [embed]})
    }
}