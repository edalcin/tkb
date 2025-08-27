# Projeto TKB (Traditional Knowledge Blockchain)

## 1. Visão Geral

O Projeto TKB é uma plataforma baseada em blockchain dedicada ao registro, autenticação e proteção do conhecimento tradicional associado à biodiversidade. A aplicação visa garantir os direitos de propriedade intelectual e a repartição justa e equitativa dos benefícios para as comunidades tradicionais, detentoras desse conhecimento.

Esta iniciativa utiliza a imutabilidade e a transparência da tecnologia blockchain para criar um registro de procedência seguro, confiável e à prova de adulteração.

## 2. Arquitetura e Tecnologias

Este projeto é um MVP (Produto Mínimo Viável) e foi construído utilizando uma arquitetura de microsserviços containerizada com Docker.

- **Containerização:** `Docker` e `Docker Compose`
  - **Descrição:** Toda a aplicação é encapsulada em contêineres, garantindo um ambiente de desenvolvimento e produção consistente e de fácil configuração.

- **Frontend (Interface Web):** `React` com `TypeScript`
  - **Descrição:** Uma interface de usuário moderna e reativa que permite às comunidades registrar seus conhecimentos e a usuários autorizados consultá-los. A interação com a blockchain no lado do cliente é feita através da biblioteca `ethers.js`.

- **Backend (API):** `Node.js` com `Express`
  - **Descrição:** Um servidor responsável por fazer a ponte entre o frontend e a infraestrutura descentralizada. Ele gerencia as requisições, interage com o IPFS e envia as transações para o contrato inteligente.

- **Blockchain:** `Ethereum (Hardhat)` e `Solidity`
  - **Descrição:** O núcleo da aplicação. Um contrato inteligente escrito em Solidity e implantado em uma rede de desenvolvimento local (Hardhat) gerencia as regras de negócio, como o registro, o controle de acesso e a lógica de repartição de benefícios.

- **Armazenamento de Dados:** `IPFS (InterPlanetary File System)`
  - **Descrição:** Para evitar os altos custos de armazenamento na blockchain, os arquivos (documentos, imagens, áudios) são armazenados no IPFS. Apenas o hash (identificador único) do conteúdo é gravado na blockchain, garantindo a integridade e a imutabilidade da referência ao dado original.

## 3. Como Executar o Projeto

1.  **Pré-requisitos:**
    -   Docker e Docker Compose instalados.

2.  **Iniciando a Aplicação:**
    -   Clone o repositório.
    -   Na raiz do projeto, execute o comando:
        ```bash
        docker-compose up --build
        ```
    -   Acesse o frontend em `http://localhost:3000`.
