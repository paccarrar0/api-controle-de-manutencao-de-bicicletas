# **Controle de Manutenção de Bicicletas**

## **Identificação**
**Nome do aluno:** Pedro Afonso Carraro

---

# **Descrição do Projeto**
A **API Controle de Manutenção de Bicicletas** é uma aplicação backend robusta desenvolvida com **NestJS**, projetada para gerenciar o ciclo de vida e a manutenção de bicicletas. O sistema permite o cadastro de usuários com diferentes níveis de acesso (Admin e User), o gerenciamento de bicicletas (CRUD), e o registro detalhado de manutenções realizadas, incluindo custos e descrições de serviço.

Além das funcionalidades principais, a API implementa um sistema de "favoritos" para bicicletas e utiliza autenticação segura via JWT. O objetivo é fornecer uma solução escalável e organizada para oficinas, lojas ou entusiastas que desejam manter um histórico digital de suas bicicletas e reparos.

**Principais Recursos:**
* **Gestão de Usuários:** Autenticação, perfis e controle de acesso (RBAC).
* **Gestão de Bicicletas:** Cadastro completo com marca, modelo, aro, cor e status.
* **Controle de Manutenções:** Histórico de reparos vinculados a cada bicicleta.
* **Segurança:** Proteção de rotas com Guards, JWT e criptografia de senhas (Argon2).
* **Documentação:** API totalmente documentada via Swagger.

---

# **Link da API em Produção**
> **URL:** [http://157.245.233.1:3000/v1/api](http://157.245.233.1:3000/v1/api)

---

# **Instruções de Execução**

## **Instalação**
* Clonar o repositório:
  * ` git clone https://github.com/paccarrar0/api-controle-de-manutencao-de-bicicletas.git `
* Navegar até a pasta do repositório:
  * ` cd api-controle-de-manutencao-de-bicicletas `
* Instalar as dependências do projeto:
  * ` npm i --legacy-peer-deps `
* Copiar o arquivo .env de exemplo para o .env e edita-lo com as credenciais de conexão:
  * ` cp .env.exemplo .env `
* Criar o database:
  * ` mysql -u <usuario> -p <senha> `
  * ` create database bicicletas_db `
* Rodar a compilação dos arquivos:
  * ` npm run prestart:prod `
* Criar e rodar a migração do banco de dados:
  * ` npm run migration:generate `
  * ` npm run migration:run `
* Rodar a aplicação:
  * ` npm run start:prod `
---

## **Pré-requisitos**

- Node.js ` v18.19.1 `
- NPM ` v9.2.0 `
- Banco de dados MySQL ` v8.0.44 `

---

# **Diagrama de Entidade-Relacionamento (ERD)**

**ERD:**  <img width="1137" height="647" alt="image" src="https://github.com/user-attachments/assets/a59d94a1-48c7-48d4-94e0-d7dec8e0ce2b" />

---

# **Documentação Swagger** 
> **URL:** [http://157.245.233.1:3000/docs/](http://157.245.233.1:3000/docs/)

---

# **Checklist de Funcionalidades**

## **RA1 — API com NestJS**
- [x] ID1 – Arquitetura modular criada
- [x] ID2 – Lógica de negócios isolada em services
- [x] ID3 – Providers e injeção de dependência configurados
- [x] ID4 – Rotas HTTP implementadas corretamente
- [x] ID5 – Tratamento de erros com filtros
- [x] ID6 – DTOs criados
- [x] ID7 – Pipes de validação aplicados

## **RA2 — Persistência com Banco Relacional**
- [x] ID8 – Modelagem do ERD concluída
- [x] ID9 – Conexão com banco via Prisma/TypeORM
- [x] ID10 – Migrações criadas e aplicadas
- [x] ID11 – CRUD implementado

## **RA4 — Documentação e Deploy**
- [x] ID14 – Swagger configurado
- [x] ID15 – Deploy realizado em ambiente de produção
- [x] ID16 – API funcionando corretamente no servidor
- [x] ID17 – Variáveis de ambiente configuradas com ConfigModule
- [x] ID18 – Versionamento da API implementado

## **RA5 — Autenticação e Segurança**
- [x] ID19 – Autenticação JWT implementada
- [x] ID20 – Controle de acesso por roles configurado
- [x] ID21 – Middleware configurado (CORS, logging, etc.)
- [x] ID22 – Interceptadores implementados
