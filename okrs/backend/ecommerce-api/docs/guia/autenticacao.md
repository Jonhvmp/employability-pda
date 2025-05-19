# Autenticação

## Visão Geral

O sistema de autenticação da API de e-commerce permite que usuários se registrem, façam login e mantenham sessões seguras. A API utiliza autenticação baseada em tokens JWT (JSON Web Tokens) para garantir a segurança das operações.

## Registro de Usuário

Para criar uma nova conta de usuário:

**Endpoint**: `POST /api/auth/register`

**Corpo da Requisição**:

```json
{
  "name": "Jonh Alex",
  "email": "jasolutionsengine@gmail.com",
  "password": "senha@123",
  "confirmPassword": "senha@123"
}
```

**Resposta de Sucesso** (201 Created):

```json
{
  "id": 42,
  "name": "Jonh Alex",
  "email": "jasolutionsengine@gmail.com",
  "createdAt": "2025-05-03T17:15:00.000Z",
  "message": "Usuário registrado com sucesso"
}
```

**Resposta de Erro** (400 Bad Request):

```json
{
  "error": "Dados inválidos",
  "details": [
    "Email já está em uso",
    "A senha deve ter pelo menos 8 caracteres",
    "As senhas não correspondem"
  ]
}
```

## Login

Para autenticar um usuário e obter um token de acesso:

**Endpoint**: `POST /api/auth/login`

**Corpo da Requisição**:

```json
{
  "email": "jasolutionsengine@gmail.com",
  "password": "senha@123"
}
```

**Resposta de Sucesso** (200 OK):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 42,
    "name": "Jonh Alex",
    "email": "jasolutionsengine@gmail.com"
  },
  "expiresIn": 86400
}
```

**Resposta de Erro** (401 Unauthorized):

```json
{
  "error": "Credenciais inválidas"
}
```

## Logout

Para encerrar uma sessão ativa:

**Endpoint**: `POST /api/auth/logout`

**Requer Autenticação**: Sim

**Resposta de Sucesso** (200 OK):

```json
{
  "message": "Logout realizado com sucesso"
}
```

## Verificar Sessão

Para verificar se o token atual é válido:

**Endpoint**: `GET /api/auth/verify`

**Requer Autenticação**: Sim

**Resposta de Sucesso** (200 OK):

```json
{
  "valid": true,
  "user": {
    "id": 42,
    "name": "Jonh Alex",
    "email": "jasolutionsengine@gmail.com"
  },
  "expiresAt": "2025-05-04T17:15:00.000Z"
}
```

## Recuperação de Senha

### Solicitar Redefinição

Para iniciar o processo de recuperação de senha:

**Endpoint**: `POST /api/auth/forgot-password`

**Corpo da Requisição**:

```json
{
  "email": "jasolutionsengine@gmail.com"
}
```

**Resposta de Sucesso** (200 OK):

```json
{
  "message": "Se o email existir em nosso sistema, você receberá um link para redefinição de senha"
}
```

> **Nota**: Por motivos de segurança, a API sempre retorna a mesma mensagem de sucesso, independentemente de o email existir ou não no sistema.

### Redefinir Senha

Para redefinir a senha usando o token recebido por email:

**Endpoint**: `POST /api/auth/reset-password`

**Corpo da Requisição**:

```json
{
  "token": "0a1b2c3d4e5f...",
  "password": "novaSenha@456",
  "confirmPassword": "novaSenha@456"
}
```

**Resposta de Sucesso** (200 OK):

```json
{
  "message": "Senha redefinida com sucesso"
}
```

**Resposta de Erro** (400 Bad Request):

```json
{
  "error": "Dados inválidos",
  "details": [
    "Token inválido ou expirado",
    "A nova senha deve ter pelo menos 8 caracteres",
    "As senhas não correspondem"
  ]
}
```

## Utilização do Token JWT

Após a autenticação bem-sucedida, todos os endpoints protegidos exigem que o token JWT seja enviado no cabeçalho de autorização de cada requisição:

```json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Estrutura do Token

O token JWT contém as seguintes informações no payload:

- **sub**: ID do usuário
- **name**: Nome do usuário
- **email**: Email do usuário
- **roles**: Funções/papéis do usuário (ex: "user", "admin")
- **iat**: Timestamp de emissão do token
- **exp**: Timestamp de expiração do token

### Erros de Autenticação

Quando um erro de autenticação ocorre, a API responde com status 401 Unauthorized:

```json
{
  "error": "Não autorizado",
  "message": "Token inválido ou expirado"
}
```

## Melhores Práticas de Segurança

1. **Armazenamento Seguro**: Armazene o token JWT de maneira segura no cliente (localStorage não é recomendado para aplicações sensíveis)

2. **HTTPS**: Todas as requisições devem ser realizadas sobre HTTPS para garantir a segurança das credenciais e tokens

3. **Senhas Fortes**: Incentive os usuários a utilizarem senhas complexas com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais

4. **Tempo de Expiração**: Os tokens têm validade limitada (24 horas por padrão) e devem ser renovados conforme necessário

5. **Logout em Múltiplos Dispositivos**: Em caso de suspeita de comprometimento da conta, utilize o endpoint de invalidação de todas as sessões

## Fluxo de Autenticação Recomendado

1. O usuário se registra ou faz login para obter um token JWT
2. O cliente armazena o token de forma segura
3. O cliente envia o token em todas as requisições subsequentes
4. Quando o token expirar, o cliente deve redirecionar o usuário para o fluxo de login novamente
5. O usuário pode fazer logout manualmente quando desejar encerrar a sessão
