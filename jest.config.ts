export default {
    testTimeout: 60000,
    moduleFileExtensions: [
      "js",
      "json",
      "ts"
    ],
    rootDir: "src",
    testRegex: ".*\\.test\\.ts$",
    transform: {
      "^.+\\.ts$": "ts-jest"
    },
    moduleNameMapper: {
      "^src/(.*)": "<rootDir>/../src/$1"
    },
    collectCoverageFrom: [
      "**/*.ts"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    setupFiles: ['<rootDir>/../jest.setup.ts'],
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "/src/common/"
    ],
};