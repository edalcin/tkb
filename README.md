# Projeto TKB (Traditional Knowledge Blockchain)

## 1. Visão Geral

O Projeto TKB é uma plataforma baseada em blockchain dedicada ao registro, autenticação e proteção do conhecimento tradicional associado à biodiversidade. A aplicação visa garantir os direitos de propriedade intelectual e a repartição justa e equitativa dos benefícios para as comunidades tradicionais, detentoras desse conhecimento.

Esta iniciativa utiliza a imutabilidade e a transparência da tecnologia blockchain para criar um registro de procedência seguro, confiável e à prova de adulteração.

## 2. Arquitetura e Tecnologias

Para simplificar a implantação e o gerenciamento, este projeto foi encapsulado em uma **imagem de contêiner único**. Um processo interno, `Supervisor`, é responsável por gerenciar todos os serviços necessários para a aplicação funcionar.

- **Containerização:** `Docker (Single Container)`
  - **Descrição:** Toda a aplicação (Frontend, Backend, Blockchain, IPFS) roda dentro de um único contêiner Docker, gerenciado pelo `Supervisor`.

- **Frontend (Interface Web):** `React` com `TypeScript`
  - **Descrição:** Uma interface de usuário moderna e reativa. O código é compilado e os arquivos estáticos resultantes são servidos diretamente pelo backend.

- **Backend (API):** `Node.js` com `Express`
  - **Descrição:** O servidor principal que expõe a API para o frontend, interage com o contrato inteligente na blockchain e gerencia o armazenamento no IPFS.

- **Blockchain:** `Ethereum (Hardhat)` e `Solidity`
  - **Descrição:** O núcleo da aplicação. Um contrato inteligente escrito em Solidity e implantado em uma rede de desenvolvimento Hardhat que roda internamente no contêiner.

- **Armazenamento de Dados:** `IPFS (Kubo)`
  - **Descrição:** O daemon do IPFS roda como um serviço interno para armazenar arquivos (documentos, imagens, etc.) de forma descentralizada. Apenas o hash do arquivo é gravado na blockchain.

- **Gerenciador de Processos:** `Supervisor`
  - **Descrição:** Uma ferramenta que garante que todos os processos (IPFS, Hardhat, Backend) sejam iniciados e mantidos em execução dentro do contêiner.

## 3. Como Executar o Projeto

1.  **Pré-requisitos:**
    -   Docker instalado.

2.  **Construindo a Imagem:**
    -   Na raiz do projeto, execute o comando para construir a imagem Docker:
        ```bash
        docker build -t tkb-app .
        ```

3.  **Iniciando o Contêiner:**
    -   Execute o contêiner mapeando a porta da aplicação (ex: 8080) e um volume para os dados persistentes do IPFS:
        ```bash
        docker run -d -p 8080:3001 --name tkb-container -v tkb-ipfs-data:/data/ipfs tkb-app
        ```
    -   Acesse o frontend em `http://localhost:8080`.