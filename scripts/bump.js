#!/usr/bin/env node

const fs = require('fs');
const { resolve } = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

const packageJsonFiles = glob.sync(resolve('**/package.json'), { ignore: '**/node_modules/**' });

function getVersions(packageName) {
  const versions = execSync(`npm v ${packageName} dist-tags --json`, { encoding: 'utf8' });
  return versions ? JSON.parse(versions) : null;
}

function getTargetVersion(packageAndVersion, moduleName) {
  const [, targetVersion] = packageAndVersion;
  let version = targetVersion;
  if (targetVersion === 'beta' || targetVersion === 'latest') {
    const versions = getVersions(moduleName);
    version = versions && versions[targetVersion];
  }
  return version;
}

function bumpPackages(packages) {
  for (const file of packageJsonFiles) {
    let changed = false;
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    const dependencies = content.dependencies || {};
    const devDependencies = content.devDependencies || {};
    const peerDependencies = content.peerDependencies || {};

    for (const _package of packages) {
      if (dependencies[_package.name]) {
        dependencies[_package.name] = `^${_package.version}`;
        changed = true;
      }
      if (devDependencies[_package.name]) {
        devDependencies[_package.name] = `^${_package.version}`;
        changed = true;
      }
      if (peerDependencies[_package.name]) {
        peerDependencies[_package.name] = `^${_package.version}`;
        changed = true;
      }
    }

    if (changed) {
      content = JSON.stringify(content, null, 2);
      fs.writeFileSync(file, `${content}\n`);
    }
  }
}

function main() {
  let packages = [];
  const args = process.argv;
  if (!args || args.length < 3) {
    console.error('Should use format "bump package" or "bump package=target_version".');
    return;
  }

  const argLen = args.length;
  for (let i = 2; i < argLen; i++) {
    const packageAndVersion = args[i].split('=');
    if (!packageAndVersion) {
      console.error('Should use format "bump package" or "bump package=target_version".');
      return;
    }

    // default to latest version
    if (packageAndVersion.length === 1) {
      packageAndVersion.push('latest');
    }

    const [packageName] = packageAndVersion;
    const modules = JSON.parse(execSync(`npm search ${packageName} --json`, { encoding: 'utf8' }));

    if (modules) {
      packages = packages.concat(
        modules.map(module => ({
          name: module.name,
          version: getTargetVersion(packageAndVersion, module.name)
        }))
      );
    }
  }

  if (packages.length) {
    console.log('Files to be updated:');
    console.log(packageJsonFiles);

    console.log('Packages:');
    console.log(packages);

    bumpPackages(packages);
  }
}

main();
