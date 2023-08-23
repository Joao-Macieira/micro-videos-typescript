const core_micro_videos_path =
  '<rootDir>/../../node_modules/@core/micro-videos/dist';

export default {
  displayName: {
    name: 'nestjs',
    color: 'magentaBright',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageProvider: "v8",
  coverageDirectory: '../__coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@core/micro\\-videos/(.*)$': `${core_micro_videos_path}/$1`,
    '#seedwork/(.*)$': `${core_micro_videos_path}/@seedwork/$1`,
    '#category/(.*)$': `${core_micro_videos_path}/category/$1`,
    '#cast-member/(.*)$': `${core_micro_videos_path}/cast-member/$1`,
  },
  setupFilesAfterEnv: ['../@core/src/@seedwork/domain/tests/jest.ts'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    },
  },
};