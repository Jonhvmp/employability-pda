# Arquitetura do Sistema

## Visão Geral

A API de E-commerce foi desenvolvida seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, permitindo uma clara separação de responsabilidades e facilitando a manutenção e evolução do sistema.

## Camadas da Arquitetura

O sistema está organizado nas seguintes camadas, do núcleo para a periferia:

### 1. Domain (Domínio)

Esta é a camada mais interna e contém as regras de negócio fundamentais e entidades do domínio. Não possui dependências externas.

- **Entidades**: Representações dos conceitos de negócio (User, Product, Order, etc.)
- **Value Objects**: Objetos imutáveis que representam conceitos do domínio sem identidade própria
- **Interfaces de Repositórios**: Contratos para acesso a dados

### 2. Application (Aplicação)

Contém a lógica de aplicação e os casos de uso. Depende apenas da camada de domínio.

- **Use Cases**: Implementação dos casos de uso do sistema
- **DTOs**: Objetos de transferência de dados
- **Interfaces de Serviços**: Contratos para serviços externos

### 3. Infrastructure (Infraestrutura)

Implementa as interfaces definidas nas camadas anteriores e gerencia recursos externos.

- **Repositórios**: Implementações dos repositórios usando Prisma ORM
- **Serviços Externos**: Integrações com serviços de terceiros
- **Configurações**: Configurações de banco de dados, cache, etc.

### 4. Presentation (Apresentação)

Responsável pela interação com o usuário e exposição da API.

- **Controllers**: Processam requisições e delegam para os casos de uso
- **Routes**: Definição dos endpoints da API
- **Middlewares**: Processamento intermediário de requisições

## Fluxo de Dados

1. Uma requisição HTTP chega em um endpoint na camada de apresentação
2. O controller correspondente processa a requisição e converte os dados para o formato interno
3. O controller chama o caso de uso apropriado na camada de aplicação
4. O caso de uso executa a lógica de negócio, utilizando entidades da camada de domínio
5. Quando necessário, o caso de uso utiliza repositórios (via interfaces) para acessar ou persistir dados
6. Os dados são transformados de volta para o formato de resposta e retornados

## Padrões Utilizados

### Dependency Inversion Principle (DIP)

As camadas mais internas definem interfaces que são implementadas pelas camadas mais externas, permitindo que as dependências apontem para dentro, não para fora.

### Repository Pattern

Abstrai o acesso a dados, permitindo que a lógica de negócio seja independente da fonte de dados.

### Dependency Injection

Facilita o teste e reduz o acoplamento entre componentes.

### Use Case Pattern

Encapsula a lógica de negócio em unidades coesas e independentes.

## Estrutura de Diretórios

```text
src/
├── app.ts                      # Configuração da aplicação Express
├── server.ts                   # Ponto de entrada da aplicação
├── application/                # Camada de aplicação
│   └── useCases/               # Casos de uso
│       ├── auth/               # Casos de uso de autenticação
│       ├── order/              # Casos de uso de pedidos
│       └── product/            # Casos de uso de produtos
├── controllers/                # Controladores HTTP
├── domain/                     # Camada de domínio
│   ├── entities/               # Entidades do domínio
│   └── interfaces/             # Interfaces de repositórios
├── infrastructure/             # Camada de infraestrutura
│   ├── errors/                 # Erros da aplicação
│   └── repositories/           # Implementações dos repositórios
├── middlewares/                # Middlewares Express
├── routes/                     # Definições de rotas
```

## Banco de Dados

O sistema utiliza PostgreSQL como banco de dados principal, com o Prisma ORM para facilitar as operações de banco de dados e garantir type safety.

O esquema do banco inclui as seguintes tabelas principais:

- **User**: Armazena informações dos usuários
- **Product**: Catálogo de produtos
- **Order**: Pedidos realizados pelos usuários
- **OrderItem**: Itens incluídos em cada pedido

## Testes

O sistema implementa diferentes níveis de testes:

- **Testes Unitários**: Testam componentes individuais, principalmente casos de uso e entidades
- **Testes de Integração**: Verificam a integração entre componentes e com o banco de dados
- **Testes E2E**: Simulam o comportamento do usuário interagindo com a API completa

## Segurança

A segurança é implementada em várias camadas:

1. **Autenticação**: Sistema baseado em JWT (JSON Web Tokens)
2. **Autorização**: Middlewares que verificam permissões para operações específicas
3. **Validação de Dados**: Validação rigorosa de todas as entradas do usuário
4. **Proteção contra Ataques Comuns**: Implementações contra CSRF, XSS, etc.

## Escalabilidade

A arquitetura foi projetada para permitir escalabilidade horizontal:

- Stateless: Não há estado de sessão no servidor
- Cache: Implementação de estratégias de cache para melhorar performance
- Transações: Garantia de consistência de dados em operações complexas

## Diagrama de Arquitetura

```markdown
┌───────────────────────┐      ┌───────────────────────┐
│                       │      │                       │
│   Presentation Layer  │      │     External APIs     │
│  (Routes/Controllers) │      │  (Payment, Shipping)  │
│                       │      │                       │
└───────────┬───────────┘      └───────────┬───────────┘
            │                              │
            ▼                              │
┌───────────────────────┐                  │
│                       │                  │
│   Application Layer   │◄─────────────────┘
│     (Use Cases)       │
│                       │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│                       │
│     Domain Layer      │
│   (Entities, Logic)   │
│                       │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│                       │
│ Infrastructure Layer  │
│ (Repositories, DBs)   │
│                       │
└───────────────────────┘
```

## Decisões Técnicas

- **TypeScript**: Escolhido para garantir type safety e melhorar a produtividade
- **Express**: Framework web leve e flexível para a API REST
- **Prisma**: ORM moderno com excelente suporte a TypeScript
- **Jest**: Framework completo para testes
- **Docker**: Containerização para padronização de ambientes de desenvolvimento e produção

## Desafios e Soluções

- **Transações Distribuídas**: Implementação de padrão Saga para manter consistência
- **Cache**: Estratégia de cache em múltiplas camadas (Redis + in-memory)
- **Autenticação**: Sistema flexível de autenticação com suporte a múltiplos provedores

## Evolução Futura

- Migração gradual para arquitetura de microserviços
- Implementação de GraphQL para consultas mais flexíveis
- Adoção de event sourcing para operações críticas
