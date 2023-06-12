import { Purchase, User } from "../../entity";
import sortTwoDArray from "../../utils/sortTwoDArray";
import { EmbedBuilder } from 'discord.js';
import { AppDataSource } from '../../data-source';

export default {
    name: 'leaderboard',
    description: 'Krijgt het leaderboard van de server tezien',
    devOnly: true,
    testOnly: true,
    // options: Object[],
    // deleted: Boolean,
    
    callback: async (client:any , interaction:any) => {
        const purchaseRepository = await AppDataSource.getRepository(Purchase);
        const userRepository = await AppDataSource.getRepository(User);
        
        let users: User[] = (await userRepository.find({ relations: ['purchases']}));
        
        let leaderboard: any[][] = [];
        
        for (const user of users) {
            let total: number = 0;

            for (const purchase of user.purchases) {
                total += purchase.price;
            }
            
            leaderboard.push([user, total]);
        }
        
        leaderboard.sort(sortTwoDArray);
        leaderboard.slice(0, 10);
        let userNames: string = ``;
        let totals: string = ``;
        
        const embed = new EmbedBuilder();
        embed.setTitle('Leaderboard');
        embed.setDescription('Dit is het leaderboard van de server');
        embed.setColor('#53fc0b');
        embed.setFooter({text: 'Shame on you all'});
        
        for (const [index, item] of leaderboard.entries()) {
            userNames += `\`${index+1}:\` ${item[0].name}\n`;
            totals += `${item[1]}\n`;
        }

        embed.addFields(
            { name: 'Top 10', value: userNames, inline: true },
            { name: 'Total', value: totals, inline: true },
        )
        
        interaction.reply({ embeds: [embed]});
    }
}