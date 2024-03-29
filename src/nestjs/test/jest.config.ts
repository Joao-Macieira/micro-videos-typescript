export default {
  ...require('../jest.config').default,
  displayName: {
    name: 'nestjs-e2e',
    color: 'yellow'
  },
  rootDir: './',
  testRegex: '.*\\.e2e-spec\\.ts$',
  maxWorkers: 1,
  setupFilesAfterEnv: ['../../@core/src/@seedwork/domain/tests/jest.ts'],
  setupFiles: ['<rootDir>/setup-test.ts'],
  moduleNameMapper: {
    '@core/micro\\-videos/(.*)$':
      '<rootDir>/../../../node_modules/@core/micro-videos/dist/$1',
    '#seedwork/(.*)$':
      '<rootDir>/../../../node_modules/@core/micro-videos/dist/@seedwork/$1',
    '#category/(.*)$':
      '<rootDir>/../../../node_modules/@core/micro-videos/dist/category/$1',
  },
};