import { User } from "../../entity";
import { EmbedBuilder } from 'discord.js';
import { AppDataSource } from '../../data-source';

export default {
    name: 'leaderboard',
    description: 'Laat zien wie er het meeste geld heeft uitgegeven 💸!',
    devOnly: false,
    testOnly: false,

    callback: async (client: any, interaction: any) => {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const users: User[] = await userRepository.find({ relations: ['purchases'] });

            if (!users.length) {
                await interaction.reply({ content: 'Er zijn nog geen aankopen geregistreerd 😱!', ephemeral: true });
                return;
            }

            // Calculate total spent per user using map and reduce
            const leaderboard: [User, number][] = users.map(user => {
                const total = user.purchases.reduce((acc, purchase) => acc + Number(purchase.price), 0);
                return [user, total];
            });

            // Sort descending by total spent and take the top 10 entries
            leaderboard.sort((a, b) => b[1] - a[1]);
            const topLeaderboard = leaderboard.slice(0, 10);

            const formatter = new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' });

            // Create a formatted string for the top 10 leaderboard entries, including the index.
            const leaderboardStr = topLeaderboard
                .map(([user, total], index) => `${index + 1}. ${formatter.format(total)} - ${user.name}`)
                .join('\n');

            // Calculate the complete total for all users.
            const completeTotal = leaderboard.reduce((acc, [, total]) => acc + total, 0);
            const completeTotalFormatted = formatter.format(completeTotal);

            // Define an array of gif URLs
            const gifArray = [
                'https://media1.tenor.com/m/22a_zafg54EAAAAd/fcdk-xavier.gif',
                'https://media1.tenor.com/m/JkGhInE2qOIAAAAd/fcdk-boma.gif',
                'https://media1.tenor.com/m/iaP5nfCiV-sAAAAd/fcdk-boma.gif',
                'https://media1.tenor.com/m/4XFXvtuN_moAAAAd/fcdk-leonidas.gif',
                'https://media1.tenor.com/m/Hedmwxz_AvgAAAAd/fcdk2-fcdk.gif'
            ];
            // Pick a random gif from the array
            const randomGif = gifArray[Math.floor(Math.random() * gifArray.length)];

            const embed = new EmbedBuilder()
                .setTitle('Leaderboard')
                .setDescription('Dit is wat iedereen heeft uitgegeven 💸!')
                .setColor('#53fc0b')
                .setImage(randomGif)
                .setTimestamp()
                .setFooter({ text: 'Shame on you all' })
                .addFields(
                    { name: 'Top 10', value: leaderboardStr },
                    { name: 'Totaal van alle gebruikers', value: completeTotalFormatted }
                );

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in leaderboard command:', error);
            await interaction.reply({ content: 'Er is een fout opgetreden bij het ophalen van het leaderboard.', ephemeral: true });
        }
    }
}
