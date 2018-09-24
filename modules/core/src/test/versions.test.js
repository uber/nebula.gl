import { readFileSync, readdirSync } from 'fs';

const PACKAGE = 'package.json';
const VERSION = 'version';
const DEPENDENCIES = 'dependencies';
const NEBULA_GL_DEP = 'nebula.gl';

it(`Verify all ${PACKAGE} have the same version`, () => {
  let version = null;

  const modules = `${__dirname}/../../../../modules`;
  readdirSync(modules).forEach(module => {
    const contents = readFileSync(`${modules}/${module}/${PACKAGE}`, 'utf8');
    const json = JSON.parse(contents);

    if (!version) {
      version = json[VERSION];
    }

    expect(json[VERSION]).toEqual(version);

    if (json[DEPENDENCIES] && json[DEPENDENCIES][NEBULA_GL_DEP]) {
      expect(json[DEPENDENCIES][NEBULA_GL_DEP]).toEqual(version);
    }
  });
});
