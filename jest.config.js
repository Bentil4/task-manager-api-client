export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["script/*.js"],
  injectGlobals: true,
  coveragePathIgnorePatterns: ["script/main.js"],
};
``;
