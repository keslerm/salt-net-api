/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "testMatch": [
    "**/tests/**/*.test.(ts|js)"
  ],  
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/lib/"],
};