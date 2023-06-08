import path from 'path';
import getAllFiles from '../utils/getAllFiles';

export default (client: any) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort();

        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

        client.on(eventName, async (arg: any) => {
            for (const eventFile of eventFiles) {
                const eventModule = await import(eventFile);
                const eventFunction = eventModule.default;
                await eventFunction(client, arg);
            }
        })
    }
};