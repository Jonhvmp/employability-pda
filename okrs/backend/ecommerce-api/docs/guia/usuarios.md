# Gerenciamento de Usuários

## Visão Geral

O módulo de usuários permite gerenciar contas de usuários na plataforma de e-commerce. Além das operações básicas de autenticação (registro e login), este módulo oferece funcionalidades para gestão de perfil, alteração de senha e gerenciamento de endereços.

## Obter Perfil do Usuário

Para obter informações do perfil do usuário autenticado:

**Endpoint**: `GET /api/users/profile`

**Requer Autenticação**: Sim

**Resposta de Sucesso** (200 OK):

```json
{
  "id": 5,
  "name": "Jonh Alex",
  "email": "jasolutionsengine@gmail.com",
  "createdAt": "2024-12-15T10:30:00.000Z",
  "updatedAt": "2025-05-01T14:20:00.000Z"
}
```

## Atualizar Perfil do Usuário

Para atualizar informações básicas do perfil:

**Endpoint**: `PUT /api/users/profile`

**Requer Autenticação**: Sim

**Corpo da Requisição**:

```json
{
  "name": "Jonh Alex Paz de Lima",
  "email": "jasolutionsengine@gmail.com"
}
```

**Resposta de Sucesso** (200 OK):

```json
{
  "id": 5,
  "name": "Jonh Alex Paz de Lima",
  "email": "jasolutionsengine@gmail.com",
  "createdAt": "2024-12-15T10:30:00.000Z",
  "updatedAt": "2025-05-03T15:45:00.000Z",
  "message": "Perfil atualizado com sucesso"
}
```

**Resposta de Erro** (400 Bad Request):

```json
{
  "error": "Dados inválidos",
  "details": [
    "Email já está em uso por outro usuário",
    "Nome deve ter entre 3 e 100 caracteres"
  ]
}
```

## Alterar Senha

Para alterar a senha do usuário:

**Endpoint**: `PUT /api/users/change-password`

**Requer Autenticação**: Sim

**Corpo da Requisição**:

```json
{
  "currentPassword": "senha123",
  "newPassword": "novaSenha456",
  "confirmPassword": "novaSenha456"
}
```

**Resposta de Sucesso** (200 OK):

```json
{
  "message": "Senha alterada com sucesso"
}
```

**Resposta de Erro** (400 Bad Request):

```json
{
  "error": "Dados inválidos",
  "details": [
    "A senha atual está incorreta",
    "A nova senha deve ter pelo menos 8 caracteres",
    "A confirmação de senha não corresponde à nova senha"
  ]
}
```

## Adicionar Endereço

Para adicionar um novo endereço ao perfil do usuário:

**Endpoint**: `POST /api/users/addresses`

**Requer Autenticação**: Sim

**Corpo da Requisição**:

```json
{
  "name": "Casa",
  "recipientName": "Jonh Alex",
  "street": "Rua das Flores",
  "number": "123",
  "complement": "Apt 101",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01001-000",
  "isDefault": true
}
```

**Resposta de Sucesso** (201 Created):

```json
{
  "id": 10,
  "name": "Casa",
  "recipientName": "Jonh Alex",
  "street": "Rua das Flores",
  "number": "123",
  "complement": "Apt 101",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01001-000",
  "isDefault": true,
  "userId": 5,
  "createdAt": "2025-05-03T16:00:00.000Z",
  "updatedAt": "2025-05-03T16:00:00.000Z"
}
```

## Listar Endereços

Para obter todos os endereços do usuário:

**Endpoint**: `GET /api/users/addresses`

**Requer Autenticação**: Sim

**Resposta de Sucesso** (200 OK):

```json
{
  "data": [
    {
      "id": 10,
      "name": "Casa",
      "recipientName": "Jonh Alex",
      "street": "Rua das Flores",
      "number": "123",
      "complement": "Apt 101",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01001-000",
      "isDefault": true,
      "createdAt": "2025-05-03T16:00:00.000Z",
      "updatedAt": "2025-05-03T16:00:00.000Z"
    },
    {
      "id": 8,
      "name": "Trabalho",
      "recipientName": "Jonh Alex",
      "street": "Avenida Paulista",
      "number": "1000",
      "complement": "10º andar",
      "neighborhood": "Bela Vista",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01310-100",
      "isDefault": false,
      "createdAt": "2025-04-10T09:30:00.000Z",
      "updatedAt": "2025-05-03T16:00:00.000Z"
    }
  ]
}
```

## Atualizar Endereço

Para atualizar um endereço existente:

**Endpoint**: `PUT /api/users/addresses/{id}`

**Requer Autenticação**: Sim

**Corpo da Requisição**:

```json
{
  "name": "Casa Nova",
  "recipientName": "Jonh Alex",
  "street": "Alameda Santos",
  "number": "500",
  "complement": "Bloco B, Apt 202",
  "neighborhood": "Jardins",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01419-000",
  "isDefault": true
}
```

**Resposta de Sucesso** (200 OK):

```json
{
  "id": 10,
  "name": "Casa Nova",
  "recipientName": "Jonh Alex",
  "street": "Alameda Santos",
  "number": "500",
  "complement": "Bloco B, Apt 202",
  "neighborhood": "Jardins",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01419-000",
  "isDefault": true,
  "userId": 5,
  "createdAt": "2025-05-03T16:00:00.000Z",
  "updatedAt": "2025-05-03T16:30:00.000Z"
}
```

**Resposta de Erro** (404 Not Found):

```json
{
  "error": "Endereço não encontrado"
}
```

## Excluir Endereço

Para remover um endereço:

**Endpoint**: `DELETE /api/users/addresses/{id}`

**Requer Autenticação**: Sim

**Resposta de Sucesso** (204 No Content)

**Resposta de Erro** (404 Not Found):

```json
{
  "error": "Endereço não encontrado"
}
```

**Resposta de Erro** (400 Bad Request):

```json
{
  "error": "Não é possível excluir o endereço padrão",
  "details": "Defina outro endereço como padrão antes de excluir este"
}
```

## Validações

O sistema realiza as seguintes validações para usuários:

- **Nome**: Obrigatório, entre 3 e 100 caracteres
- **Email**: Obrigatório, formato válido, único no sistema
- **Senha**: Obrigatória para registro, mínimo 8 caracteres
- **Endereços**:
  - CEP: formato brasileiro válido (XXXXX-XXX)
  - Estado: sigla de 2 letras (UF)
  - Cidade, Rua e Bairro: campos obrigatórios
  - Número: obrigatório para endereços brasileiros

## Boas Práticas

1. Mantenha suas informações de perfil atualizadas
2. Use senhas fortes com combinação de letras, números e símbolos
3. Adicione seus endereços mais utilizados para agilizar o processo de compra
4. Verifique periodicamente suas informações de contato
