// jest.config.js (ESM)
export default {
  testEnvironment: "node",
  // No transforms — we’re not using Babel
  transform: {},
  // DO NOT add extensionsToTreatAsEsm when "type": "module" is set
  // extensionsToTreatAsEsm: ['.js'], // ❌ remove

  // Optional: helps with imports that include .js extensions
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  // Optional: if you want to explicitly pick up both test/ and tests/
  // testMatch: ['**/test/**/*.test.js', '**/tests/**/*.test.js'],
};
``;
