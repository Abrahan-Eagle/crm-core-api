
const fs = require('fs');
const { execSync } = require('child_process');

function installModules() {

  // Change working directory to bundle folder
  process.chdir(__dirname);

  if (!needsToInstallModules()) return console.log('Bundle is up to date!');

  if (!nodeModulesExists()) installDependencies()

  console.log('Removing old @internal dependencies...');
  fs.rmSync('./@internal', { recursive: true, force: true });
  console.log('Moving downloaded @internal dependencies...');
  fs.renameSync('./node_modules/@internal', './@internal');
  console.log('Removing node_modules...');
  fs.rmSync('./node_modules', { recursive: true, force: true });
  console.log('Done!')
}


function needsToInstallModules() {
  try {
   
    generatePackageLock();
    const { dependencies } = require('./package.json');
    const packages = fs.readdirSync('@internal');

    showWarningForNonInternalPackages(dependencies);

    if (Object.keys(dependencies).length !== packages.length) return true;

    for (const package of packages) {
      const key = `@internal/${package}`;
      if (!dependencies[key]) return true;

      const { version: lockVersion } = require(`./package-lock.json`).packages[`node_modules/${key}`];
      const { version: installVersion } = require(`./@internal/${package}/package.json`);

      if (lockVersion !== installVersion) return true;
    }

    return false;
  } catch (error) {
    return true;
  }

}

function generatePackageLock() {
  try {
    console.log('Checking for newer versions...');
    execSync('npm install --package-lock-only');
  } catch (error) {
    console.log('ERROR: Failed to generate package-lock.json');
    process.exit(1);
  }
}

function nodeModulesExists() {
  try {
    fs.statSync('./node_modules/@internal');
    return true;
  } catch (error) {
    return false;
  }
}

function installDependencies() {
  try {
    console.log('Installing @internal dependencies...');
    execSync('npm install --omit=dev');
    console.log('Installation done!')
  } catch (error) {
    console.log('ERROR: Installation failed!')
    process.exit(1);
  }
}

function showWarningForNonInternalPackages(dependencies) {

  const nonInternalDeps = Object.keys(dependencies).filter(key => !key.startsWith('@internal'))
  if (nonInternalDeps.length === 0) return;

  console.log(`WARNING: You have non-internal packages in your dependencies: ${nonInternalDeps.join(', ')}`);

}


installModules();
