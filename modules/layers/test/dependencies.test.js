import { readFileSync, readdirSync, existsSync } from 'fs';

const RESOLVED_REGEX = /^resolved/gi;
const NOT_ALLOWED_REPO = 'unpm.u';
const EXAMPLES_DIR = `${__dirname}/../../../examples`;

it(`Ensure yarn.lock doesn't contain ${NOT_ALLOWED_REPO}`, () => {
  const rootLockFile = `${__dirname}/../../../yarn.lock`;
  const exampleLockFiles = readdirSync(`${EXAMPLES_DIR}`)
    .map((example) => `${EXAMPLES_DIR}/${example}/yarn.lock`)
    .filter(existsSync);

  [rootLockFile, ...exampleLockFiles].forEach((lockfile) => {
    const contents = readFileSync(lockfile, 'utf8').split('\n');

    contents.forEach((line) => {
      if (line.trim().match(RESOLVED_REGEX)) {
        expect(line).not.toEqual(expect.stringContaining(NOT_ALLOWED_REPO));
      }
    });
  });
});
