import { Product } from './Product';

describe('Entidade Produto', () => {
  it('deve criar um produto com parâmetros válidos', () => {
    const product = new Product('Laptop', 2500, 10, 'Um laptop poderoso');

    expect(product.name).toBe('Laptop');
    expect(product.price).toBe(2500);
    expect(product.stock).toBe(10);
    expect(product.description).toBe('Um laptop poderoso');
    expect(product.isAvailable()).toBe(true);
  });

  it('deve lançar erro ao criar um produto com nome inválido', () => {
    expect(() => {
      new Product('', 2500, 10);
    }).toThrow('Nome do produto não pode ser vazio');
  });

  it('deve lançar erro ao criar um produto com preço negativo', () => {
    expect(() => {
      new Product('Laptop', -100, 10);
    }).toThrow('Preço não pode ser negativo');
  });

  it('deve lançar erro ao criar um produto com estoque negativo', () => {
    expect(() => {
      new Product('Laptop', 2500, -5);
    }).toThrow('Estoque não pode ser negativo');
  });

  it('deve atualizar as propriedades do produto corretamente', () => {
    const product = new Product('Laptop', 2500, 10);

    product.name = 'Laptop Gamer';
    product.price = 3000;
    product.stock = 5;
    product.description = 'Laptop gamer de alta performance';

    expect(product.name).toBe('Laptop Gamer');
    expect(product.price).toBe(3000);
    expect(product.stock).toBe(5);
    expect(product.description).toBe('Laptop gamer de alta performance');
  });

  it('deve diminuir o estoque corretamente', () => {
    const product = new Product('Laptop', 2500, 10);

    product.decreaseStock(3);

    expect(product.stock).toBe(7);
  });

  it('deve lançar erro quando diminuir o estoque mais do que o disponível', () => {
    const product = new Product('Laptop', 2500, 10);

    expect(() => {
      product.decreaseStock(15);
    }).toThrow('Estoque insuficiente para o produto Laptop');
  });

  it('deve aumentar o estoque corretamente', () => {
    const product = new Product('Laptop', 2500, 10);

    product.increaseStock(5);

    expect(product.stock).toBe(15);
  });

  it('deve retornar falso para isAvailable quando o estoque é 0', () => {
    const product = new Product('Laptop', 2500, 0);

    expect(product.isAvailable()).toBe(false);
  });

  it('deve retornar a representação JSON correta', () => {
    const product = new Product('Laptop', 2500, 10, 'Um laptop poderoso');
    const json = product.toJSON();

    expect(json).toHaveProperty('name', 'Laptop');
    expect(json).toHaveProperty('price', 2500);
    expect(json).toHaveProperty('stock', 10);
    expect(json).toHaveProperty('description', 'Um laptop poderoso');
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
  });
});
