const path = require('node:path');

const { pathsToModuleNameMapper } = require('ts-jest');

const createJestConfig = (options = {}) => {
  const { compilerOptions } = tryRequire(options.tsconfigPath || './tsconfig.json', () => {
    if (options.tsconfigPath) throw new Error(`Could not find tsconfig.json at "${options.tsconfigPath}"`);
  }) || {};
  const displayName = tryRequire('./package.json')?.name;

  return {
    displayName,
    preset: 'ts-jest',
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: './',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    coverageDirectory: './coverage',
    collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/constants.ts'],
    testEnvironment: 'node',
    transformIgnorePatterns: ['/node_modules/', '/dist/'],
    modulePaths: compilerOptions?.baseUrl && [compilerOptions.baseUrl],
    moduleNameMapper: compilerOptions?.paths && pathsToModuleNameMapper(compilerOptions.paths),
    ...options,
  };
};

module.exports = {
  createJestConfig,
  default: createJestConfig
};

function tryRequire(modulePath, handleError) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(path.resolve(modulePath));
  } catch (e) {
    handleError?.(e);
  }
}
