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
        const purchaseRepository = new PurchaseRepository(Purchase);
        const userRepository = new UserRepository(User);
        
        let users: User[] = (await userRepository.getAll()).slice(0, 10);
        
        let leaderboard: any[][] = [];
        
        for (const user of users) {
            let purchases: Purchase[] = await purchaseRepository.getAllFromUser(user);
            let total: number = 0;
            for (const purchase of purchases) {
                total += purchase.price;
            }
            
            leaderboard.push([user, total]);
        }
        
        leaderboard.sort(sortTwoDArray);
        
        purchaseRepository.disconnect();
        
        const embed = new client.EmbedBuilder()
        .setTitle('Leaderboard')
        .setDescription('Dit is het leaderboard van de server')
        .setColor('#53fc0b')
        .setFooter('Shame on you all');
        
        for (const item of leaderboard) {
            embed.addField({name: `${item[0].name} € ${item[1]}`});
        }
        
        interaction.reply({ embeds: [embed]});
    }
}