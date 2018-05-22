const plist = require('plist');
const execFile = require('child_process').execFile;
const path = require('path');

function info(imagePath) {
    return hdiutilExec(['info', '-plist'])
        .then(plist.parse)
        .then(result => {
            const image = result.images.filter(image => {
                const currentImagePath = image['image-path']
                return currentImagePath === imagePath || path.basename(currentImagePath) === path.basename(imagePath)
            }).pop();

            if (!image) {
                throw new Error("Image not found!");
            }

            const entity = image['system-entities'].filter(entity => !!entity['mount-point']).pop();
            if (!entity) {
                throw new Error("Entity not found!");
            }

            return {
                mountPath: entity['mount-point'],
                devicePath: entity['dev-entry'],
                encrypted: image['image-encrypted'],
                imageType: entity['image-type']
            };
        });
}

function isEncrypted(imagePath) {
    return hdiutilExec(['isencrypted', imagePath, '-plist'])
        .then(plist.parse)
        .then(result => {
            return result.encrypted;
        });
}

function attach(imagePath, options) {
    options = options || {};
    const args = ['attach', imagePath, '-plist',];

    if (options.mountpoint) {
        args.push('-mountpoint', options.mountpoint);
    }

    if (options.readonly) {
        args.push('-readonly');
    }

    if (options.password) {
        args.push('-stdinpass');
    }

    if (options.nobrowse) {
        args.push('-nobrowse');
    }

    args.push(options.autoopen ? '-autoopen' : '-noautoopen');

    return hdiutilExec(args, options.password)
        .then(plist.parse);;
}

function detach(imagePath, force) {
    return info(imagePath)
        .then(imageInfo => {
            var args = ['detach', imageInfo.devicePath];
            if (force) {
                args.push('-force');
            }

            return hdiutilExec(args);
        });
}

function create(imagePath, options) {
    const args = ['create', imagePath, '-plist'];
    if (options.encryption) {
        args.push('-encryption', options.encryption);
    }

    if (options.size) {
        args.push('-size', options.size);
    }

    if (options.sectors) {
        args.push('-sectors', options.sectors);
    }

    if (options.fs) {
        args.push('-fs', options.fs);
    }

    if (options.volname) {
        args.push('-volname', options.volname);
    }

    if (options.srcfolder) {
        args.push('-srcfolder', options.srcfolder);
    }

    if (options.srcdevice) {
        args.push('-srcdevice', options.srcdevice);
    }

    if (options.attach) {
        args.push('-attach');
    }

    if (options.password) {
        args.push('-stdinpass');
    }

    if (options.type) {
        args.push('-type', options.type);
    }

    return hdiutilExec(args, options.password)
        .then(plist.parse);
}

function hdiutilExec(args, password) {
    return new Promise((resolve, reject) => {
        const proc = execFile('/usr/bin/hdiutil', args, (error, result) => {
            if (error) {
                return reject(error);
            }

            resolve(result);
        });

        if (password) {
            const stdin = proc.stdin;
            stdin.setEncoding('UTF-8');
            stdin.write(password);
            stdin.end();
        }
    });
}

module.exports = {
    info,
    attach,
    detach,
    create,
    isEncrypted
};
