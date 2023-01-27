// check if yarn.lock contains private registery information
// replaces "lint-yarn": "!(grep -q unpm.u yarn.lock) && echo 'Lockfile valid.' || (echo 'Please rebuild yarn file using public npmrc' && false)",

const fs = require('fs');
const lockFileContent = fs.readFileSync('yarn.lock', 'utf8');

if (lockFileContent.includes('unpm.u')) {
  console.error('Please rebuild yarn file using public npmrc');
  process.exitCode = 1;
} else {
  console.log('Lockfile valid');
}
