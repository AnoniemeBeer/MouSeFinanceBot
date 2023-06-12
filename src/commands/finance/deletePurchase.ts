import { ApplicationCommandOptionType } from 'discord.js';
import { User, Purchase } from '../../entity';
import { AppDataSource } from '../../data-source';

export default {
    name: 'verwijder-aankoop',
    description: 'Verwijder een aankoop',
    devOnly: false,
    testOnly: false,
    options: [
        {
            name: 'purchase_id',
            description: "Het id van de aankoop die je wilt verwijderen, gebruik /aankopen om de id's te zien",
            type: ApplicationCommandOptionType.Number,
            required: true, 
        },
    ],
    // deleted: Boolean,
    
    callback: async (client:any , interaction:any) => {
        const purchaseRepository = AppDataSource.getRepository(Purchase);
        const purchaseId = interaction.options.getNumber('purchase_id');

        const purchase = await purchaseRepository.findOne({where: {id: purchaseId}, relations: ['user']});

        if (purchase == null){
            interaction.reply({ content: 'Deze aankoop bestaat niet', ephemeral: true });
            return;
        }

        await purchaseRepository.delete(purchaseId);

        interaction.reply({ content: `De aankoop \`${purchase.description}\`(€${purchase.price}) van \`${purchase.user.name}\` is verwijderd.`});
    }
}