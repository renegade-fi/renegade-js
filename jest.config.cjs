module.exports = {
  "preset": "ts-jest/presets/js-with-ts-esm",
  "testEnvironment": "node",
  "roots": [
    "<rootDir>"
  ],
  "testMatch": [
    "<rootDir>/__tests__/**/*.test.ts",
  ],
  "testTimeout": 600000,
}
