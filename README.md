# Lista de Tarefas - Aplicação Full Stack com DDD

![Tecnologias](https://img.shields.io/badge/.NET%207-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Tecnologias](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tecnologias](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tecnologias](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tecnologias](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## 📋 Sobre o Projeto

Esta aplicação de gerenciamento de tarefas foi desenvolvida seguindo os princípios de **Domain-Driven Design (DDD)**, demonstrando uma arquitetura limpa e escalável para aplicações empresariais. O sistema permite que usuários gerenciem suas tarefas diárias com recursos completos de CRUD, categorização e acompanhamento de prazos.

### 🌟 Principais Características

- **Arquitetura DDD Completa**: Separação clara entre domínio, aplicação, infraestrutura e API
- **Autenticação JWT**: Sistema seguro de login e registro com tokens JWT
- **Interface Responsiva**: Frontend desenvolvido com React e TypeScript
- **Multilíngue**: Interface totalmente em Português Brasileiro
- **Containerização**: Configuração Docker completa para desenvolvimento e produção
- **Banco de Dados**: Integração com PostgreSQL via Entity Framework Core

## 🏗️ Arquitetura do Projeto

### Backend (Padrão DDD)

```
backend/
├── TodoList.Domain/            # Núcleo da aplicação
│   ├── Entities/               # Entidades de domínio (User, Task)
│   └── Interfaces/             # Contratos de repositórios e serviços
│
├── TodoList.Application/       # Casos de uso da aplicação
│   ├── DTOs/                   # Objetos de transferência de dados
│   └── Services/               # Implementação dos serviços de aplicação
│
├── TodoList.Infrastructure/    # Implementações técnicas
│   ├── Data/                   # Contexto EF Core e configurações
│   └── Repositories/           # Implementações dos repositórios
│
└── TodoList.API/               # Camada de apresentação
    ├── Controllers/            # Endpoints da API REST
    └── Configurations/         # Configurações da aplicação
```

#### Camadas do DDD Implementadas:

1. **Camada de Domínio**: Contém as entidades de negócio (User, Task) e regras de domínio
2. **Camada de Aplicação**: Orquestra os fluxos de uso entre o domínio e a infraestrutura
3. **Camada de Infraestrutura**: Implementa persistência e serviços externos
4. **Camada de API**: Expõe os endpoints RESTful para consumo

### Frontend (React + TypeScript)

```
frontend/
├── public/                     # Arquivos estáticos
├── src/
│   ├── components/             # Componentes reutilizáveis
│   ├── contexts/               # Contextos React (Auth, Task)
│   ├── pages/                  # Páginas da aplicação
│   ├── services/               # Serviços de API
│   ├── styles/                 # Estilos CSS/SCSS
│   └── types/                  # Definições de tipos TypeScript
└── Dockerfile                  # Configuração para containerização
```

## 🔧 Tecnologias Utilizadas

### Backend
- **.NET 7**: Framework moderno para desenvolvimento de APIs
- **Entity Framework Core**: ORM para acesso ao banco de dados
- **PostgreSQL**: Banco de dados relacional
- **JWT Authentication**: Autenticação baseada em tokens
- **Swagger/OpenAPI**: Documentação automática da API

### Frontend
- **React 18**: Biblioteca para construção de interfaces
- **TypeScript**: Tipagem estática para JavaScript
- **Axios**: Cliente HTTP para consumo de APIs
- **React Router**: Navegação entre páginas
- **Context API**: Gerenciamento de estado global
- **date-fns**: Formatação de datas com suporte a PT-BR

### DevOps
- **Docker**: Containerização da aplicação
- **Docker Compose**: Orquestração de múltiplos containers
- **Nginx**: Servidor web para o frontend em produção

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados
- Git

### Usando Docker (Recomendado)

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/To-Do-ListDDD.git
cd To-Do-ListDDD
```

2. Inicie os containers:
```bash
docker-compose up -d
```

3. Acesse:
   - **Frontend**: http://localhost:3000
   - **API**: http://localhost:5000/api
   - **Swagger**: http://localhost:5000/swagger

### Desenvolvimento Local

#### Backend:
```bash
cd backend/TodoList.API
dotnet restore
dotnet run
```

#### Frontend:
```bash
cd frontend
npm install
npm start
```

## 📱 Funcionalidades Implementadas

### Autenticação
- Registro de novos usuários
- Login com email e senha
- Proteção de rotas autenticadas
- Gerenciamento de perfil de usuário

### Gerenciamento de Tarefas
- Criação de novas tarefas com título, descrição e data limite
- Visualização de tarefas com filtros (todas, pendentes, concluídas, atrasadas)
- Edição de tarefas existentes
- Marcação de tarefas como concluídas/pendentes
- Exclusão de tarefas

## 🔄 Fluxo de Dados

1. **Autenticação**:
   - O usuário envia credenciais para `/api/auth/login`
   - A API valida e retorna um token JWT
   - O frontend armazena o token no localStorage
   - Requisições subsequentes incluem o token no header Authorization

2. **Operações de Tarefas**:
   - Requisições autenticadas são enviadas para `/api/tasks`
   - A API processa através das camadas: Controller → Service → Repository
   - O domínio aplica regras de negócio (ex: verificação de tarefas atrasadas)
   - Respostas são retornadas como DTOs padronizados

## 🧪 Testes

O projeto inclui testes para garantir a qualidade do código:

- **Testes Unitários**: Validam a lógica de negócio isoladamente
- **Testes de Integração**: Verificam a interação entre componentes
- **Testes End-to-End**: Simulam o comportamento do usuário

Para executar os testes:
```bash
cd backend
dotnet test
```

## 📚 Padrões de Projeto Aplicados

- **Repository Pattern**: Abstração da camada de dados
- **Dependency Injection**: Inversão de controle para baixo acoplamento
- **DTO Pattern**: Transferência segura de dados entre camadas
- **Unit of Work**: Gerenciamento de transações no banco de dados
- **Context Provider Pattern**: Gerenciamento de estado no React

## 🔒 Segurança

- Senhas armazenadas com hash seguro (bcrypt)
- Proteção contra CSRF
- Validação de entrada de dados
- Tokens JWT com expiração configurável
- HTTPS em produção

## 🌐 Implantação

O projeto está configurado para fácil implantação em ambientes de produção:

1. **Configuração de Variáveis de Ambiente**:
   - Conexão com banco de dados
   - Chaves de segurança JWT
   - URLs de API

2. **Build de Produção**:
   - Frontend otimizado com `npm run build`
   - Backend compilado em modo Release

3. **Containers Docker**:
   - Imagens leves e otimizadas
   - Configuração de rede isolada
   - Volumes persistentes para dados

## 👨‍💻 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

---

Desenvolvido com ❤️ como demonstração de arquitetura DDD e boas práticas de desenvolvimento.