// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/*.test.(ts|js)'],
  moduleDirectories: ['node_modules'],
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest'
  },
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: 'coverage'
};
