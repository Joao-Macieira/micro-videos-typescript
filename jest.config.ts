export default {
  clearMocks: true,
  coverageProvider: "v8",
  rootDir: "src",
  testRegex: ".*\\..*spec\\.ts$",
  transform: {
    '^.+\\.ts?$': ['@swc/jest'],
  },
  setupFilesAfterEnv: ["./@shared/domain/tests/validations.ts"],
  coverageDirectory: '<rootDir>/../__coverage',
  coverageThreshold: {
    global: {
      statements : 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};
