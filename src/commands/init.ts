import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { exec, green } from '../utils';

const copyStatic = async () => {
  green('Copying files 📂');

  const staticPath = path.resolve(__dirname, '../../static');
  await exec(`cp -rfn ${staticPath}/ .`);
};

const modifyPackage = async () => {
  green('Modifing package ⛏');

  const writeFile = promisify(fs.writeFile);
  const pkgPath = path.resolve('./package.json');
  const pkg = require(pkgPath);
  const newPkg = {
    ...pkg,
    engines: {
      node: '>=8.5.0'
    },
    scripts: {
      ...pkg.scripts,
      bootstrap: 'ts-node-toolbox init',
      typecheck: "tsc --project tsconfig.json --noEmit",
      dev: 'ts-node-toolbox dev',
      test: 'ts-node-toolbox test',
      'test:ci': 'ts-node-toolbox test --runInBand --coverage',
      build: 'ts-node-toolbox build',
      release: 'ts-node-toolbox release'
    },
    main: 'dist/es5/index.js',
    types: 'dist/es5/index.d.ts',
    files: ['dist'],
    keywords: pkg.keywords || [],
    repository: pkg.repository || ''
  };

  await writeFile(pkgPath, JSON.stringify(newPkg, null, 2));
};

export const init = async () => {
  try {
    await modifyPackage();
    await copyStatic();
    green('Project created 🚀');
  } catch (err) {
    console.log(err);
  }
};
