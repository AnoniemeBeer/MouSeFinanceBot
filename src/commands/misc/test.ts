export default {
    name: 'test',
    description: 'test!',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],
    // deleted: Boolean,

    callback: (client:any , interaction:any) => {
        interaction.reply(`test!`);
    }
}