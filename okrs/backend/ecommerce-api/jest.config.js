/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  clearMocks: true,
  testPathIgnorePatterns: ['/node_modules/'],
  // Configurações adicionais
  verbose: true,
  displayName: 'Ecommerce API',
  bail: 5, // Para nos falhar rapidamente em caso de múltiplas falhas
  testTimeout: 10000, // Timeout de 10 segundos para testes
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80
    }
  },
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  errorOnDeprecated: true,
  maxWorkers: '50%', // Utiliza metade dos CPUs disponíveis
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'], // Arquivo para configurações globais de teste
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }]
  },
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
