# Produtos

## Visão Geral

O módulo de Produtos da API de e-commerce permite o gerenciamento completo do catálogo de produtos, incluindo criação, consulta, atualização e remoção de itens. Este documento detalha todas as operações disponíveis relacionadas a produtos.

## Listar Produtos

Retorna uma lista paginada de produtos disponíveis na loja.

**Endpoint**: `GET /api/products`

**Parâmetros de Query**:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `sort` (opcional): Campo para ordenação (padrão: "createdAt")
- `order` (opcional): Direção da ordenação ("asc" ou "desc", padrão: "desc")
- `search` (opcional): Texto para busca em nome/descrição
- `category` (opcional): ID da categoria para filtrar
- `minPrice` (opcional): Preço mínimo
- `maxPrice` (opcional): Preço máximo

**Resposta de Sucesso** (200 OK):
```json
{
  "products": [
    {
      "id": 1,
      "name": "Smartphone XYZ",
      "description": "Smartphone de última geração com câmera de 48MP",
      "price": 1999.90,
      "stock": 15,
      "imageUrl": "https://exemplo.com/imagens/smartphone-xyz.jpg",
      "category": "Eletrônicos",
      "createdAt": "2025-04-15T10:30:00.000Z",
      "updatedAt": "2025-05-01T08:45:00.000Z"
    },
    {
      "id": 2,
      "name": "Notebook Ultra",
      "description": "Notebook leve e potente com 16GB de RAM",
      "price": 4500.00,
      "stock": 8,
      "imageUrl": "https://exemplo.com/imagens/notebook-ultra.jpg",
      "category": "Informática",
      "createdAt": "2025-04-18T14:20:00.000Z",
      "updatedAt": "2025-04-30T09:15:00.000Z"
    }
    // ... outros produtos
  ],
  "pagination": {
    "total": 42,
    "pages": 5,
    "currentPage": 1,
    "limit": 10
  }
}
```

## Obter Detalhes do Produto

Retorna informações detalhadas de um produto específico.

**Endpoint**: `GET /api/products/:id`

**Parâmetros de URL**:
- `id`: ID do produto

**Resposta de Sucesso** (200 OK):
```json
{
  "id": 1,
  "name": "Smartphone XYZ",
  "description": "Smartphone de última geração com câmera de 48MP",
  "price": 1999.90,
  "stock": 15,
  "imageUrl": "https://exemplo.com/imagens/smartphone-xyz.jpg",
  "category": "Eletrônicos",
  "specifications": {
    "weight": "180g",
    "dimensions": "150 x 70 x 8 mm",
    "display": "6.5 polegadas AMOLED",
    "battery": "4500 mAh",
    "processor": "Octa-core 2.8GHz",
    "storage": "128GB",
    "ram": "6GB"
  },
  "ratings": {
    "average": 4.7,
    "count": 28
  },
  "createdAt": "2025-04-15T10:30:00.000Z",
  "updatedAt": "2025-05-01T08:45:00.000Z"
}
```

**Resposta de Erro** (404 Not Found):
```json
{
  "error": "Produto não encontrado"
}
```

## Criar Produto

Adiciona um novo produto ao catálogo.

**Endpoint**: `POST /api/products`

**Requer Autenticação**: Sim (Admin)

**Corpo da Requisição**:
```json
{
  "name": "Tablet Pro",
  "description": "Tablet profissional com tela de alta resolução",
  "price": 2499.90,
  "stock": 12,
  "imageUrl": "https://exemplo.com/imagens/tablet-pro.jpg",
  "category": "Eletrônicos",
  "specifications": {
    "weight": "490g",
    "dimensions": "250 x 170 x 6 mm",
    "display": "10.9 polegadas Retina",
    "battery": "8000 mAh",
    "processor": "A14 Bionic",
    "storage": "256GB",
    "ram": "8GB"
  }
}
```

**Resposta de Sucesso** (201 Created):
```json
{
  "id": 3,
  "name": "Tablet Pro",
  "description": "Tablet profissional com tela de alta resolução",
  "price": 2499.90,
  "stock": 12,
  "imageUrl": "https://exemplo.com/imagens/tablet-pro.jpg",
  "category": "Eletrônicos",
  "specifications": {
    "weight": "490g",
    "dimensions": "250 x 170 x 6 mm",
    "display": "10.9 polegadas Retina",
    "battery": "8000 mAh",
    "processor": "A14 Bionic",
    "storage": "256GB",
    "ram": "8GB"
  },
  "createdAt": "2025-05-03T18:20:00.000Z",
  "updatedAt": "2025-05-03T18:20:00.000Z"
}
```

**Resposta de Erro** (400 Bad Request):
```json
{
  "error": "Dados inválidos",
  "details": [
    "O nome do produto é obrigatório",
    "O preço deve ser um número positivo",
    "A URL da imagem deve ser válida"
  ]
}
```

## Atualizar Produto

Atualiza as informações de um produto existente.

**Endpoint**: `PUT /api/products/:id`

**Requer Autenticação**: Sim (Admin)

**Parâmetros de URL**:
- `id`: ID do produto

**Corpo da Requisição** (campos para atualização):
```json
{
  "name": "Smartphone XYZ Plus",
  "description": "Versão atualizada do Smartphone XYZ com câmera de 64MP",
  "price": 2199.90,
  "stock": 20
}
```

**Resposta de Sucesso** (200 OK):
```json
{
  "id": 1,
  "name": "Smartphone XYZ Plus",
  "description": "Versão atualizada do Smartphone XYZ com câmera de 64MP",
  "price": 2199.90,
  "stock": 20,
  "imageUrl": "https://exemplo.com/imagens/smartphone-xyz.jpg",
  "category": "Eletrônicos",
  "updatedAt": "2025-05-03T18:30:00.000Z"
}
```

## Excluir Produto

Remove um produto do catálogo.

**Endpoint**: `DELETE /api/products/:id`

**Requer Autenticação**: Sim (Admin)

**Parâmetros de URL**:
- `id`: ID do produto

**Resposta de Sucesso** (200 OK):
```json
{
  "message": "Produto excluído com sucesso"
}
```

**Resposta de Erro** (404 Not Found):
```json
{
  "error": "Produto não encontrado"
}
```

## Upload de Imagem do Produto

Faz o upload de uma imagem para um produto.

**Endpoint**: `POST /api/products/:id/image`

**Requer Autenticação**: Sim (Admin)

**Parâmetros de URL**:
- `id`: ID do produto

**Tipo de Requisição**: `multipart/form-data`

**Campos do Formulário**:
- `image`: Arquivo de imagem (PNG, JPG ou WEBP, máx. 5MB)

**Resposta de Sucesso** (200 OK):
```json
{
  "imageUrl": "https://exemplo.com/imagens/produtos/smartphone-xyz-123456.jpg",
  "message": "Imagem enviada com sucesso"
}
```

**Resposta de Erro** (400 Bad Request):
```json
{
  "error": "Formato de arquivo inválido",
  "details": "Apenas formatos PNG, JPG e WEBP são aceitos"
}
```

## Avaliações de Produtos

### Listar Avaliações

Retorna as avaliações de um produto específico.

**Endpoint**: `GET /api/products/:id/ratings`

**Parâmetros de URL**:
- `id`: ID do produto

**Parâmetros de Query**:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Resposta de Sucesso** (200 OK):
```json
{
  "ratings": [
    {
      "id": 1,
      "userId": 42,
      "userName": "Jonh Alex",
      "rating": 5,
      "comment": "Produto excelente, entrega rápida e produto corresponde à descrição",
      "createdAt": "2025-04-20T15:30:00.000Z"
    },
    {
      "id": 2,
      "userId": 18,
      "userName": "João Silva",
      "rating": 4,
      "comment": "Bom produto, mas achei o preço um pouco elevado",
      "createdAt": "2025-04-22T09:45:00.000Z"
    }
    // ... outras avaliações
  ],
  "average": 4.7,
  "total": 28,
  "pagination": {
    "total": 28,
    "pages": 3,
    "currentPage": 1,
    "limit": 10
  }
}
```

### Adicionar Avaliação

Adiciona uma nova avaliação a um produto.

**Endpoint**: `POST /api/products/:id/ratings`

**Requer Autenticação**: Sim

**Parâmetros de URL**:
- `id`: ID do produto

**Corpo da Requisição**:
```json
{
  "rating": 4,
  "comment": "Muito bom, mas poderia ser mais barato"
}
```

**Resposta de Sucesso** (201 Created):
```json
{
  "id": 29,
  "rating": 4,
  "comment": "Muito bom, mas poderia ser mais barato",
  "userId": 42,
  "userName": "Jonh Alex",
  "createdAt": "2025-05-03T18:45:00.000Z"
}
```

**Resposta de Erro** (400 Bad Request):
```json
{
  "error": "Dados inválidos",
  "details": [
    "A avaliação deve ser entre 1 e 5",
    "Você já avaliou este produto"
  ]
}
```

## Categorias de Produtos

### Listar Categorias

Retorna todas as categorias de produtos disponíveis.

**Endpoint**: `GET /api/categories`

**Resposta de Sucesso** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Eletrônicos",
    "description": "Smartphones, tablets e outros dispositivos eletrônicos",
    "productCount": 15
  },
  {
    "id": 2,
    "name": "Informática",
    "description": "Notebooks, computadores e acessórios",
    "productCount": 23
  },
  {
    "id": 3,
    "name": "Acessórios",
    "description": "Capas, carregadores e outros acessórios",
    "productCount": 42
  }
]
```

### Produtos por Categoria

Retorna todos os produtos de uma categoria específica.

**Endpoint**: `GET /api/categories/:id/products`

**Parâmetros de URL**:
- `id`: ID da categoria

**Parâmetros de Query**:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Resposta de Sucesso** (200 OK):
```json
{
  "category": {
    "id": 1,
    "name": "Eletrônicos",
    "description": "Smartphones, tablets e outros dispositivos eletrônicos"
  },
  "products": [
    {
      "id": 1,
      "name": "Smartphone XYZ",
      "description": "Smartphone de última geração com câmera de 48MP",
      "price": 1999.90,
      "imageUrl": "https://exemplo.com/imagens/smartphone-xyz.jpg"
    },
    // ... outros produtos
  ],
  "pagination": {
    "total": 15,
    "pages": 2,
    "currentPage": 1,
    "limit": 10
  }
}
```

## Considerações Importantes

1. **Controle de Estoque**: O sistema automaticamente verifica o estoque disponível antes de permitir a compra de produtos

2. **Preços**: Os preços devem ser sempre informados em Reais (BRL)

3. **Cache**: As listagens de produtos são cacheadas por 5 minutos para melhorar a performance

4. **Imagens**: As URLs de imagens devem sempre apontar para recursos acessíveis publicamente

5. **Permissões**: A criação, atualização e exclusão de produtos são operações restritas a usuários com privilégios administrativos
