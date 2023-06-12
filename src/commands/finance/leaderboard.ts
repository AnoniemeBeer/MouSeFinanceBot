import { PurchaseRepository, UserRepository } from "../../repository";
import { Purchase, User } from "../../model";
import sortTwoDArray from "../../utils/sortTwoDArray";
import { EmbedBuilder } from 'discord.js';

export default {
    name: 'leaderboard',
    description: 'Krijgt het leaderboard van de server tezien',
    devOnly: true,
    testOnly: true,
    // options: Object[],
    // deleted: Boolean,
    
    callback: async (client:any , interaction:any) => {
        // const purchaseRepository = new PurchaseRepository(Purchase);
        // const userRepository = new UserRepository(User);

        // await userRepository.connect();
        
        // let users: User[] = (await userRepository.getAll());
        
        // let leaderboard: any[][] = [];
        
        // for (const user of users) {
        //     let purchases: Purchase[] = await purchaseRepository.getAllFromUser(user);
        //     let total: number = 0;
        //     for (const purchase of purchases) {
        //         total += purchase.price;
        //     }
            
        //     leaderboard.push([user, total]);
        // }
        
        // leaderboard.sort(sortTwoDArray);
        // leaderboard.slice(0, 10);
        // let userNames: string = ``;
        // let totals: string = ``;
        
        // await purchaseRepository.disconnect();
        
        // const embed = new EmbedBuilder();
        // embed.setTitle('Leaderboard');
        // embed.setDescription('Dit is het leaderboard van de server');
        // embed.setColor('#53fc0b');
        // embed.setFooter({text: 'Shame on you all'});
        
        // for (const item of leaderboard) {
        //     // userNames += `\`${index}:\` ${item[0].name}\n`;
        //     userNames += `${item[0].name}\n`;
        //     totals += `${item[1]}\n`;
        // }

        // embed.addFields(
        //     { name: 'Top 10', value: userNames, inline: true },
        //     { name: 'Total', value: totals, inline: true },
        // )
        
        // interaction.reply({ embeds: [embed]});
        interaction.reply({ content: 'This command is not yet implemented' });
    }
}