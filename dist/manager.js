import fs from 'fs';
class CmdManager {
    constructor(folder, lang) {
        this.run = (cmdName, args) => {
            if (!this.ResgisteredCommands)
                return;
            if (typeof this.ResgisteredCommands[cmdName] !== 'function')
                return;
            this.ResgisteredCommands[cmdName](args);
        };
        let fileType = '.' + lang;
        fs.readdir(folder, (_, files) => {
            files.forEach(file => {
                if (file.endsWith(fileType)) {
                    const func = require(`${folder}/${file}`).default;
                    let fileName = file.replace(fileType, '');
                    this.ResgisteredCommands = Object.assign({}, this.ResgisteredCommands),
                        this.ResgisteredCommands[fileName] = func;
                }
                ;
            });
        });
    }
    ;
}
;
export default CmdManager;
