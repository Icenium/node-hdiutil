# hdiutil

Provides limited set of OSX hdiutil api for Node.js

### Installation

### Retrieve information about already attached image by it's path

```javascript
const hdiutil = require('hdiutil');
hdiutil.info('image.dmg')
.then(imageInfo) => {
  console.log(imageInfo.mountPath);
  console.log(imageInfo.devicePath);
  console.log(imageInfo.encrypted);
  console.log(imageInfo.imageType);
});
```

### Create image

```javascript
const hdiutil = require('hdiutil');
hdiutil.create('image.dmg', {
    // password that will be automatically passed to stdin
    password: '...',
    // specify a particular type of encryption
    encryption: 'AES-128',
    // specify the file system
    fs: 'HFS+',
    // specify the format of empty read/write images
    type: 'SPARSE'
})
.then(result => {
    console.log(result);
})
```

### Attaching image

```javascript
const hdiutil = require('hdiutil');
hdiutil.attach('image.dmg', {
  // password that will be automatically passed to stdin
  password: '...',
  // read-only mount (default = false)
  readonly: true,
  // hide it from user (default = false)
  nobrowse: true,
  // auto open in Finder (default = false)
  autoopen: true
})
.then(result => {
    console.log(result);
});
```

### Detaching image

```javascript
const hdiutil = require('hdiutil');
hdiutil.detach('image.dmg', true /*force (default = false)*/)
```
