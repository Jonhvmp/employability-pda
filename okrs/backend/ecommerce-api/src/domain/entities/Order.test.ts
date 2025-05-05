import { Order, OrderStatus } from './Order';
import { OrderItem } from './OrderItem';

describe('Entidade Pedido', () => {
  // Helper para criar OrderItems para os testes
  const createOrderItems = () => [
    new OrderItem(1, 2, 100), // subtotal: 200
    new OrderItem(2, 1, 50)   // subtotal: 50
  ];

  it('deve criar um pedido com parâmetros válidos', () => {
    const userId = 1;
    const items = createOrderItems();
    const order = new Order(userId, items);

    expect(order.userId).toBe(userId);
    expect(order.items).toHaveLength(2);
    expect(order.total).toBe(250); // 200 + 50
    expect(order.status).toBe(OrderStatus.PENDING);
    expect(order.createdAt).toBeInstanceOf(Date);
    expect(order.updatedAt).toBeInstanceOf(Date);
  });

  it('deve lançar erro ao criar um pedido sem itens', () => {
    expect(() => {
      new Order(1, []);
    }).toThrow('Um pedido deve conter pelo menos um item');
  });

  it('deve calcular o total corretamente com base nos itens', () => {
    const order = new Order(1, createOrderItems());
    expect(order.total).toBe(250); // 200 + 50
  });

  it('deve adicionar um novo item corretamente', () => {
    const order = new Order(1, createOrderItems());
    const initialTotal = order.total;

    const newItem = new OrderItem(3, 3, 75); // subtotal: 225
    order.addItem(newItem);

    expect(order.items).toHaveLength(3);
    expect(order.items).toContainEqual(newItem);
    expect(order.total).toBe(initialTotal + 225);
  });

  it('deve substituir um item se o ID do produto já existir', () => {
    const order = new Order(1, createOrderItems());

    // Este item tem o mesmo productId do primeiro item, mas quantidade e preço diferentes
    const updatedItem = new OrderItem(1, 4, 120); // productId: 1
    order.addItem(updatedItem);

    expect(order.items).toHaveLength(2); // Mantém o mesmo número de itens
    expect(order.items.find(i => i.productId === 1)).toEqual(updatedItem);
    expect(order.total).toBe(530); // 4*120 + 1*50
  });

  it('deve remover um item corretamente', () => {
    const order = new Order(1, createOrderItems());
    const initialTotal = order.total;

    order.removeItem(1); // Remover item do produto 1 (subtotal 200)

    expect(order.items).toHaveLength(1);
    expect(order.items.find(i => i.productId === 1)).toBeUndefined();
    expect(order.total).toBe(initialTotal - 200);
  });

  it('deve lançar erro ao remover um item inexistente', () => {
    const order = new Order(1, createOrderItems());

    expect(() => {
      order.removeItem(999); // ID inexistente
    }).toThrow('Item não encontrado no pedido');
  });

  it('deve lançar erro ao remover todos os itens', () => {
    const order = new Order(1, [new OrderItem(1, 1, 100)]);

    expect(() => {
      order.removeItem(1);
    }).toThrow('Um pedido não pode ficar sem itens');
  });

  it('deve alterar o status corretamente', () => {
    const order = new Order(1, createOrderItems());

    order.changeStatus(OrderStatus.PAID);
    expect(order.status).toBe(OrderStatus.PAID);

    order.changeStatus(OrderStatus.SHIPPED);
    expect(order.status).toBe(OrderStatus.SHIPPED);
  });

  it('não deve permitir alteração de status de um pedido cancelado', () => {
    const order = new Order(1, createOrderItems());

    order.changeStatus(OrderStatus.CANCELED);

    expect(() => {
      order.changeStatus(OrderStatus.SHIPPED);
    }).toThrow('Um pedido cancelado não pode mudar de status');
  });

  it('não deve permitir alterar um pedido entregue para qualquer status, exceto CANCELADO', () => {
    const order = new Order(1, createOrderItems());

    order.changeStatus(OrderStatus.DELIVERED);

    expect(() => {
      order.changeStatus(OrderStatus.SHIPPED);
    }).toThrow('Um pedido entregue só pode ser cancelado');

    // Mas deve permitir cancelar um pedido entregue
    expect(() => {
      order.changeStatus(OrderStatus.CANCELED);
    }).not.toThrow();
  });

  it('deve cancelar um pedido corretamente', () => {
    const order = new Order(1, createOrderItems());

    order.cancel();

    expect(order.status).toBe(OrderStatus.CANCELED);
  });

  it('não deve permitir cancelar um pedido já entregue', () => {
    const order = new Order(1, createOrderItems(), OrderStatus.DELIVERED);

    expect(() => {
      order.cancel();
    }).toThrow('Um pedido já entregue não pode ser cancelado');
  });

  it('deve retornar a representação JSON correta', () => {
    const userId = 1;
    const items = createOrderItems();
    const order = new Order(userId, items);
    const json = order.toJSON();

    expect(json).toHaveProperty('userId', userId);
    expect(json).toHaveProperty('items');
    expect(json.items).toHaveLength(2);
    expect(json).toHaveProperty('total', 250);
    expect(json).toHaveProperty('status', OrderStatus.PENDING);
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
  });
});
