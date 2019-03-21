import { readFileSync } from 'fs';

const RESOLVED_REGEX = /^resolved/gi;
const ALLOWED_REPO = 'https://registry.yarnpkg.com/';

it(`Ensure yarn.lock only uses ${ALLOWED_REPO}`, () => {
  const lockfile = `${__dirname}/../../../../yarn.lock`;
  const contents = readFileSync(lockfile, 'utf8').split('\n');

  contents.forEach(line => {
    if (line.trim().match(RESOLVED_REGEX)) {
      expect(line).toEqual(expect.stringContaining(ALLOWED_REPO));
    }
  });
});
