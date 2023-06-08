export default {
    name: 'ping',
    description: 'Pong!',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],
    // deletde: Boolean,

    callback: (client:any , interaction:any) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    }
}