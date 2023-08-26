export default {
    testMatch: ['<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}'],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
    resetMocks: false,
    collectCoverage: true,
    collectCoverageFrom: ["<rootDir>/lib/**/*.{js,ts,tsx}"],
    coverageThreshold: {
      "global": {
        lines: 90,
        statements: 90,
        functions: 90
      }
    }
};
