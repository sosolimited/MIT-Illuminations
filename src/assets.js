const fse = require('fs-extra')
const path = require('path');
const {app} = require('electron');
const default_shows = require('./starterPack/shows.js');

function copyAssets() {
    // generate path to user assets folder, based on user data path
    // (platform independent)
    const destDir = path.join(app.getPath('userData'), 'user_uploads');

    const assets = [
        'blank.png', 'gray.png'];

    // auto generate assets list based on starter pack assets
    default_shows.forEach(show => {
        // get thumbnail
        assets.push(show.info.thumbnail);

        // get any file input types
        Object.keys(show.controls).forEach(key => {
            const control = show.controls[key];
            if (control.type === 'image') {
                assets.push(control.value);
            }
        });
    });

    assets.forEach(function (item) {
        const srcPath = path.join(__dirname, '..', 'extraResources', item)
        const destPath = path.join(destDir, item);

        fse.pathExists(destPath, (err, exists) => {
            // Error in evaluation
            if (err) {
                console.log(err)
            }
            // Evaluation result t/f
            if (exists) {
                // File Exists
            } else {
                // Assets Copying
                fse.copy(srcPath, destPath, (error) => {
                    if (error) return console.error(error)
                }).catch(console.log);
            }
        })
    })
}

module.exports = {
    copyAssets: copyAssets
}
