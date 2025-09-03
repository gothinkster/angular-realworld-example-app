let fs = require('fs');
packageData = JSON.parse(fs.readFileSync('package.json'));
packageData.optionalDependencies = {}; // clear optionalDependencies
fs.writeFileSync('package.json', JSON.stringify(packageData, null, 2));
