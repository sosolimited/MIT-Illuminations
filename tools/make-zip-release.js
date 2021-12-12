const zipfolder = require('zip-a-folder');
const path = require('path');
const pkgjson = require('../package.json');

console.log('Creating a zipped build for ' + pkgjson.version);

const NAME = pkgjson.name;

const type = process.argv[2];

const settings = {
    windows: {
        build_folder: path.join(__dirname, `../dist_electron/win-unpacked/`),
        dest_zip: path.join(__dirname, `../${NAME}-Windows-` + pkgjson.version + '.zip')
    },
    mac: {
        build_folder: path.join(__dirname, `../${NAME}-darwin-x64/`),
        dest_zip: path.join(__dirname, `../${NAME}-macOS-` + pkgjson.version + '.zip')
    }
};

(async () => {
    await zipfolder.zip(settings[type].build_folder, settings[type].dest_zip);

    console.log('Release ready: ' + settings[type].dest_zip);
})();
