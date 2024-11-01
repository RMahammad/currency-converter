import nextJest from "next/jest.js";
import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

// Custom Jest configuration
const customJestConfig: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    // Map @/ to the src directory
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Uncomment if you have a setup file
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

export default createJestConfig(customJestConfig);
