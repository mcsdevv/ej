// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    setupFilesAfterEnv: ['./node_modules/riteway-jest/src/riteway-jest.js'],
    clearMocks: true,
    modulePaths: ['<rootDir>'],
    coverageDirectory: 'coverage',
    roots: ['<rootDir>'],
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.spec).[tj]s?(x)'],
}
