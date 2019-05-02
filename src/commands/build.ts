import * as path from 'path';
import { writeFileSync } from 'fs';
import { spawn } from 'child_process';
import {CompilerOptions, ScriptTarget, ModuleResolutionKind} from 'typescript';
import { binPath, green } from '../utils';

const cwd = process.cwd();

const es5Config: CompilerOptions = {
  importHelpers: true,
  noImplicitAny: true,
  removeComments: true,
  declaration: true,
  outDir: `${cwd}/dist/es5`,
  lib: ['es6'],
  esModuleInterop: true,
  target: ScriptTarget.ES5,
  moduleResolution: ModuleResolutionKind.NodeJs
};

const es2015Config = {
  ...es5Config,
  "outDir": `${cwd}/dist/es2015`,
    "lib": ["dom", "es6"],
    "module": "es2015",
    "moduleResolution": "node"
};

const makeConfig = (options:any) => ({
  "compilerOptions": options,
  "include": [`${cwd}/src/**/*.ts`, `${cwd}/src/**/*.tsx`]
});

const tscBin = binPath('tsc');
const buildES5 = (): Promise<void> => {
  return new Promise((resolve) => {
    green('Creating ES5 dist 🌟');

    const configPath = path.resolve(__dirname, '../../tsconfig.es5.json');
    writeFileSync(configPath, JSON.stringify(makeConfig(es5Config), null, ' '));
    // NODE_ENV=production
    const subprocess = spawn(tscBin, ['-p', configPath], {
      env: {...process.env, FORCE_COLOR: 'true'},
      stdio: 'inherit'
    });

    subprocess.on('exit', resolve);
  });
};

const buildES2015 = () => {
  return new Promise((resolve) => {
    green('Creating ES2015 dist 🌟🌟');

    const configPath = path.resolve(__dirname, '../../tsconfig.es2015.json');
    writeFileSync(configPath, JSON.stringify(makeConfig(es2015Config), null, ' '));
    const subprocess = spawn(tscBin, ['-p', configPath], {
      env: {...process.env, FORCE_COLOR: 'true'},
      stdio: 'inherit'
    });

    subprocess.on('exit', resolve);
  });
};

export const build = async () => {
  try {
    await buildES5();
    await buildES2015();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
