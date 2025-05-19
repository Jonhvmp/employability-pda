# Gerenciamento de Pedidos

## Visão Geral

O módulo de pedidos permite que usuários criem e gerenciem pedidos na plataforma de e-commerce. Um pedido contém informações sobre os produtos adquiridos, quantidades, preços e status do pedido.

## Criar um Novo Pedido

Para criar um novo pedido de compra:

**Endpoint**: `POST /api/orders`

**Requer Autenticação**: Sim

**Corpo da Requisição**:

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

**Resposta de Sucesso** (201 Created):

```json
{
  "id": 42,
  "userId": 5,
  "status": "PENDING",
  "totalAmount": 5299.97,
  "items": [
    {
      "id": 101,
      "productId": 1,
      "quantity": 2,
      "price": 2499.99,
      "subtotal": 4999.98,
      "productName": "Smartphone Galaxy X10"
    },
    {
      "id": 102,
      "productId": 3,
      "quantity": 1,
      "price": 299.99,
      "subtotal": 299.99,
      "productName": "Fone de Ouvido Bluetooth"
    }
  ],
  "createdAt": "2025-05-03T14:30:00.000Z",
  "updatedAt": "2025-05-03T14:30:00.000Z"
}
```

**Resposta de Erro** (400 Bad Request):

```json
{
  "error": "Dados inválidos",
  "details": [
    "É necessário incluir pelo menos um item no pedido",
    "Produto com ID 10 não encontrado",
    "Quantidade deve ser maior que zero",
    "Produto com ID 1 não possui estoque suficiente"
  ]
}
```

## Listar Pedidos do Usuário Atual

Para obter todos os pedidos do usuário autenticado:

**Endpoint**: `GET /api/orders/my-orders`

**Requer Autenticação**: Sim

**Parâmetros de Query (opcionais)**:

- `page`: Número da página para paginação (padrão: 1)
- `limit`: Número de itens por página (padrão: 10)
- `status`: Filtrar por status (ex: 'PENDING', 'COMPLETED', 'CANCELLED')

**Resposta de Sucesso** (200 OK):

```json
{
  "data": [
    {
      "id": 42,
      "status": "PENDING",
      "totalAmount": 5299.97,
      "createdAt": "2025-05-03T14:30:00.000Z",
      "updatedAt": "2025-05-03T14:30:00.000Z",
      "itemCount": 2
    },
    {
      "id": 39,
      "status": "COMPLETED",
      "totalAmount": 4999.99,
      "createdAt": "2025-05-01T10:15:00.000Z",
      "updatedAt": "2025-05-01T15:20:00.000Z",
      "itemCount": 1
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

## Obter Detalhes de um Pedido

Para obter informações detalhadas sobre um pedido específico:

**Endpoint**: `GET /api/orders/{id}`

**Requer Autenticação**: Sim

**Resposta de Sucesso** (200 OK):

```json
{
  "id": 42,
  "userId": 5,
  "status": "PENDING",
  "totalAmount": 5299.97,
  "items": [
    {
      "id": 101,
      "productId": 1,
      "quantity": 2,
      "price": 2499.99,
      "subtotal": 4999.98,
      "productName": "Smartphone Galaxy X10",
      "productDescription": "Smartphone com tela AMOLED de 6.5 polegadas"
    },
    {
      "id": 102,
      "productId": 3,
      "quantity": 1,
      "price": 299.99,
      "subtotal": 299.99,
      "productName": "Fone de Ouvido Bluetooth",
      "productDescription": "Fone de ouvido sem fio com cancelamento de ruído"
    }
  ],
  "createdAt": "2025-05-03T14:30:00.000Z",
  "updatedAt": "2025-05-03T14:30:00.000Z"
}
```

**Resposta de Erro** (404 Not Found):

```json
{
  "error": "Pedido não encontrado"
}
```

**Resposta de Erro** (403 Forbidden):

```json
{
  "error": "Você não tem permissão para acessar este pedido"
}
```

## Cancelar um Pedido

Para cancelar um pedido pendente:

**Endpoint**: `PUT /api/orders/{id}/cancel`

**Requer Autenticação**: Sim

**Resposta de Sucesso** (200 OK):

```json
{
  "id": 42,
  "status": "CANCELLED",
  "message": "Pedido cancelado com sucesso"
}
```

**Resposta de Erro** (404 Not Found):

```json
{
  "error": "Pedido não encontrado"
}
```

**Resposta de Erro** (400 Bad Request):

```json
{
  "error": "Este pedido não pode ser cancelado",
  "details": "Apenas pedidos com status PENDING podem ser cancelados"
}
```

## Status dos Pedidos

Os pedidos podem ter os seguintes status:

- **PENDING**: Pedido criado, aguardando processamento
- **PROCESSING**: Pedido em processamento (pagamento aprovado)
- **SHIPPED**: Pedido enviado
- **DELIVERED**: Pedido entregue
- **COMPLETED**: Pedido finalizado com sucesso
- **CANCELLED**: Pedido cancelado

## Considerações de Implementação

1. O sistema verifica automaticamente a disponibilidade do estoque ao criar um pedido
2. Quando um pedido é criado, o estoque é reservado
3. Se um pedido for cancelado, o estoque é reabastecido
4. Os preços dos produtos são registrados no momento da criação do pedido
5. O cálculo do total do pedido é feito no servidor para garantir precisão

## Regras de Negócio

- Um pedido precisa ter pelo menos um item
- Um pedido só pode ser cancelado se estiver com status PENDING ou PROCESSING
- Apenas o usuário que criou o pedido ou um administrador pode visualizá-lo
- Usuários administradores podem visualizar todos os pedidos através do endpoint `/api/orders`
