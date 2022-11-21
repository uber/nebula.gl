const fs = require('fs');

// check if yarn.lock contains private registery information
const lockFileContent = fs.readFileSync('yarn.lock', 'utf8');

if (lockFileContent.includes('unpm.u')) {
  console.error('Please rebuild yarn file using public npmrc');
  process.exitCode = 1;
} else {
  console.log('Lockfile valid');
}
