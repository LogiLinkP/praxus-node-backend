const fs = require('fs');

export function upload(name: string, data: string) {
    fs.writeFileSync(name, data);
}