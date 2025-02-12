import { ActivityType } from "discord.js";

// An array of the statuses the bot can have
let statuses = [
    {
        name: "Doe da ni",
    },
    {
        name: "Tlag aan de setup",
    },
    {
        name: "Tlag aan den auto",
    },
    {
        name: "Tlag ni aan mij",
    },
    {
        name: "Mijn zakgeld was op",
    },
    {
        name: "Da mocht ni van die van ons",
    },
    {
        name: "BLIJ?! Ik wou dat 't al weekend was",
    },
    {
        name: "Efkes in 't rood is geen probleem he",
    },
];

export default (client: any) => {
    let random = Math.floor(Math.random() * statuses.length);
    client.user!.setActivity(statuses[random].name, {
        type: ActivityType.Watching,
    });
    // Set the client's activity to a random status every hour
    setInterval(() => {
        let random = Math.floor(Math.random() * statuses.length);
        client.user!.setActivity(statuses[random].name, {
            type: ActivityType.Watching,
        });
    }, 1000 * 60 * 10);
};
