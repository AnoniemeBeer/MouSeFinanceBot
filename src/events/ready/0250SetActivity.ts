import { ActivityType } from 'discord.js';

// An array of the statuses the bot can have
let statuses = [
    {
        name: 'Doe da ni',
        type: ActivityType.Watching,
    },
    {
        name: 'Tlag aan de setub',
        type: ActivityType.Watching,
    },
    {
        name: 'Tlag aan den auto',
        type: ActivityType.Watching,
    },
    {
        name: 'Tlach ni aan m',
        type: ActivityType.Watching,
    },
];

export default (client: any) => {
    // Set the client's activity to a random status every hour
    setInterval(() => {
        let random = Math.floor(Math.random() * statuses.length);
        client.user.setActivity(statuses[random]);
    }, 3600000 )
};

