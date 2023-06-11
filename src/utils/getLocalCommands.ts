import * as path from 'path';
import getAllFiles from '../utils/getAllFiles';

export default (exceptions: any = []) => {
    let localCommands: any = [];

    const commandCategories = getAllFiles(path.join(__dirname, '..', 'commands'), true);

    for (const commandCategory of commandCategories) {
        const commandFiles = getAllFiles(commandCategory);
        
        for (const commandFile of commandFiles) {
            const commandModule = require(commandFile);
            const commandObject = commandModule.default;

            if (exceptions.includes(commandObject.name))
                continue;
            localCommands.push(commandObject);
        }
    }

    return localCommands;
};