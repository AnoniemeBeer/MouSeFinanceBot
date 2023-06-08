import fs from 'fs';
import path from 'path';

export default (directory:any , foldersOnly = false): string[] => {
    let fileNames:string[] = [];
    
    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
        const filePath:string = path.join(directory, file.name);

        if (foldersOnly) {
            if (file.isDirectory()) {
                fileNames.push(filePath);
            }
        }else{
            if(file.isFile()){
                fileNames.push(filePath);
            }
        }
    }
    return fileNames;
};