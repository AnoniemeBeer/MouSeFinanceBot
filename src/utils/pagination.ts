import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";

export default async (interaction:any, pages:any, time = 60 * 1000) => {
    if (!interaction || !pages) throw new Error('[Paginatio] No valid args');
    
    await interaction.deferReply();
    
    if (pages.length === 1) {
        return interaction.editReply({ embeds: pages, components: [], fetchReply: true });
    }
    
    var currentPage = 0;
    
    const first = new ButtonBuilder()
    .setCustomId('pageFirst')
    .setEmoji('⏮️')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(true);
    
    const previous = new ButtonBuilder()
    .setCustomId('pagePrevious')
    .setEmoji('⏪')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(true);
    
    const pageCount = new ButtonBuilder()
    .setCustomId('pageCount')
    .setLabel(`Page ${currentPage + 1}/${pages.length}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);
    
    const next = new ButtonBuilder()
    .setCustomId('pageNext')
    .setEmoji('⏩')
    .setStyle(ButtonStyle.Primary);
    
    const last = new ButtonBuilder()
    .setCustomId('pageLast')
    .setEmoji('⏭️')
    .setStyle(ButtonStyle.Primary);
    
    const buttons = new ActionRowBuilder().addComponents([first, previous, pageCount, next, last]);
    
    const msg = await interaction.editReply({ embeds: [pages[currentPage]], components: [buttons], fetchReply: true });
    
    const collector = msg.createMessageComponentCollector({ 
        componentType: ComponentType.Button, time: time 
    });
    
    collector.on('collect', async (button: any) => {
        if (button.user.id !== interaction.user.id) {
            return button.reply({ content: 'You cannot interact with this menu', ephemeral: true });
        }
        
        await button.deferUpdate();
        
        if (button.customId === 'pageFirst') {
            currentPage = 0;
            pageCount.setLabel(`Page ${currentPage + 1}/${pages.length}`);
        }
        
        if (button.customId === 'pagePrevious') {
            currentPage = currentPage - 1;
            pageCount.setLabel(`Page ${currentPage + 1}/${pages.length}`);
        }
        
        if (button.customId === 'pageNext') {
            currentPage = currentPage + 1;
            pageCount.setLabel(`Page ${currentPage + 1}/${pages.length}`);
        }
        
        if (button.customId === 'pageLast') {
            currentPage = pages.length - 1;
            pageCount.setLabel(`Page ${currentPage + 1}/${pages.length}`);
        }
        
        if (currentPage === 0) {
            first.setDisabled(true);
            previous.setDisabled(true);
        } else {
            first.setDisabled(false);
            previous.setDisabled(false);
        }
        
        if (currentPage === pages.length - 1) {
            next.setDisabled(true);
            last.setDisabled(true);
        } else {
            next.setDisabled(false);
            last.setDisabled(false);
        }
        
        await msg.edit({ embeds: [pages[currentPage]], components: [buttons] }).catch((e: Error) => {throw e});
        
        collector.resetTimer();
    });
    
    collector.on('end', async () => {
        await msg.edit({ embeds: [pages[currentPage]], components: [] }).catch(() => {});
    });
}