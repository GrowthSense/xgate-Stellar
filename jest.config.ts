// jest.config.js
module.exports = {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: ".",
    testEnvironment: "node",
    testMatch: ["**/*.spec.ts", "**/*.e2e-spec.ts"],
    transform: {
      "^.+\\.(t|j)s$": "ts-jest",
    },
    moduleNameMapper: {
      "^src/(.*)$": "<rootDir>/src/$1",
    },
  };
  