import { OrderItem } from './OrderItem';

describe('Entidade ItemPedido', () => {
  it('deve criar um item de pedido com parâmetros válidos', () => {
    const orderItem = new OrderItem(1, 2, 150.50, 5, 10);

    expect(orderItem.productId).toBe(1);
    expect(orderItem.quantity).toBe(2);
    expect(orderItem.price).toBe(150.50);
    expect(orderItem.orderId).toBe(5);
    expect(orderItem.id).toBe(10);
  });

  it('deve lançar erro ao criar um item de pedido com quantidade inválida', () => {
    expect(() => {
      new OrderItem(1, 0, 150.50);
    }).toThrow('Quantidade deve ser um número inteiro maior que zero');

    expect(() => {
      new OrderItem(1, -1, 150.50);
    }).toThrow('Quantidade deve ser um número inteiro maior que zero');

    expect(() => {
      new OrderItem(1, 2.5, 150.50);
    }).toThrow('Quantidade deve ser um número inteiro maior que zero');
  });

  it('deve lançar erro ao criar um item de pedido com preço negativo', () => {
    expect(() => {
      new OrderItem(1, 2, -10);
    }).toThrow('Preço não pode ser negativo');
  });

  it('deve calcular o subtotal corretamente', () => {
    const orderItem = new OrderItem(1, 3, 50);

    expect(orderItem.getSubtotal()).toBe(150); // 3 * 50
  });

  it('deve retornar a representação JSON correta com subtotal', () => {
    const orderItem = new OrderItem(1, 2, 75, 5, 10);
    const json = orderItem.toJSON();

    expect(json).toHaveProperty('id', 10);
    expect(json).toHaveProperty('orderId', 5);
    expect(json).toHaveProperty('productId', 1);
    expect(json).toHaveProperty('quantity', 2);
    expect(json).toHaveProperty('price', 75);
    expect(json).toHaveProperty('subtotal', 150); // 2 * 75
  });
});
