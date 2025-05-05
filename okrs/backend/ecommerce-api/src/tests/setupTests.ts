// Este arquivo é carregado automaticamente antes de cada teste
// Use-o para configurações que precisam ser aplicadas em todos os testes

// Aumenta o timeout global para 10 segundos (10000ms)
jest.setTimeout(10000);

// Silencia logs durante testes
// Descomente se precisar reduzir o ruído no console durante testes
// global.console.log = jest.fn();
// global.console.warn = jest.fn();
// global.console.error = jest.fn();

// Limpa todos os mocks depois de cada teste
afterEach(() => {
  jest.clearAllMocks();
});
