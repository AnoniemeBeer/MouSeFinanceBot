export default {
    name: 'leaderboard',
    description: 'Krijgt het leaderboard van de server tezien',
    devOnly: true,
    testOnly: true,
    // options: Object[],
    // deleted: Boolean,

    callback: (client:any , interaction:any) => {
        interaction.reply(
            {
                content: `Moet nog geimplementeerd worden`,
                ephemeral: true,
            }
        );
    }
}