# 🌱 Projeto TKB (Traditional Knowledge Blockchain)

## 📋 Visão Geral

O Projeto TKB é uma plataforma baseada em blockchain dedicada ao registro, autenticação e proteção do conhecimento tradicional associado à biodiversidade. A aplicação visa garantir os direitos de propriedade intelectual e a repartição justa e equitativa dos benefícios para as comunidades tradicionais, detentoras desse conhecimento.

Esta iniciativa utiliza a imutabilidade e a transparência da tecnologia blockchain para criar um registro de procedência seguro, confiável e à prova de adulteração.

## 🏗️ Arquitetura e Tecnologias

### Stack Tecnológico

Para simplificar a implantação e o gerenciamento, este projeto foi arquitetado como uma **aplicação containerizada single-container** com múltiplos serviços gerenciados internamente.

#### 🐳 **Containerização**
- **Docker** com arquitetura single-container
- **Supervisor** para gerenciamento de processos internos
- **Alpine Linux** como base para otimização de tamanho

#### 🌐 **Frontend**
- **React 18** com **TypeScript**
- Interface responsiva e moderna
- Integração direta com APIs do backend
- Build otimizado servido estaticamente

#### ⚡ **Backend**
- **Node.js 18** com **Express.js**
- **TypeScript** para tipagem estática
- **Ethers.js v5** para interação com blockchain
- **IPFS HTTP Client** para armazenamento descentralizado
- **CORS** habilitado para integração frontend

#### ⛓️ **Blockchain**
- **Hardhat** como framework de desenvolvimento
- **Solidity ^0.8.19** para smart contracts
- Rede de desenvolvimento local (chainId: 1337)
- **Ethers.js** para deploy e interação com contratos

#### 📂 **Armazenamento**
- **IPFS (Kubo v0.21.0)** para armazenamento descentralizado
- Smart contracts armazenam apenas hashes IPFS
- Dados off-chain distribuídos e imutáveis

#### 🔧 **Ferramentas de Desenvolvimento**
- **Hardhat Toolbox** com plugins essenciais
- **TypeScript** em todo o stack
- **Supervisor** para gerenciamento de processos
- Scripts de deploy automatizados

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Docker** instalado e funcionando
- **Git** para clonar o repositório

### Passos para Execução

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   cd tkb
   ```

2. **Construa a imagem Docker:**
   ```bash
   docker build -t tkb-app .
   ```

3. **Execute o contêiner:**
   ```bash
   docker run -d -p 8080:3001 --name tkb-container tkb-app
   ```

4. **Deploy do smart contract e dados de teste:**
   ```bash
   docker exec tkb-container sh -c "cd /app/blockchain && npx hardhat run simple-deploy.js --network localhost"
   ```

5. **Acesse a aplicação:**
   - **Frontend:** http://localhost:8080
   - **API Backend:** http://localhost:8080/api/knowledge
   - **Status:** http://localhost:8080/api/hello

### 🧹 Limpeza (Opcional)
```bash
# Parar e remover o contêiner
docker stop tkb-container && docker rm tkb-container

# Remover a imagem
docker rmi tkb-app
```

## 📊 Funcionalidades

### Smart Contract (KnowledgeRegistry)
- ✅ **Registro de Conhecimento:** Função `registerKnowledge()` para registrar novos conhecimentos
- ✅ **Consulta de Registros:** Função `getAllRecords()` para listar todos os conhecimentos registrados
- ✅ **Estrutura de Dados:** Armazena ID, hash IPFS, responsável da comunidade, ID da comunidade e timestamp
- ✅ **Eventos:** Emite evento `KnowledgeRegistered` para cada novo registro

### API Backend
- ✅ **GET /api/hello** - Status da aplicação
- ✅ **GET /api/knowledge** - Lista todos os conhecimentos registrados
- ✅ **Conectividade Blockchain** - Conexão automática com smart contract
- ✅ **Integração IPFS** - Cliente HTTP para armazenamento descentralizado

### Interface Frontend
- ✅ **Dashboard Principal** - Visualização dos registros de conhecimento
- ✅ **Cards Responsivos** - Interface moderna e amigável
- ✅ **Testes de Conectividade** - Botões para testar backend e recarregar dados
- ✅ **Informações Detalhadas** - Exibe comunidade, responsável, data e hash IPFS

## 🗂️ Estrutura do Projeto

```
tkb/
├── 🐳 Dockerfile                    # Container principal
├── 📄 docker-compose.yml           # Configuração multi-serviço (alternativa)
├── ⚙️ supervisord.conf              # Gerenciamento de processos
├── 📚 README.md                     # Documentação
├── 🌐 frontend/                     # Aplicação React
│   ├── src/
│   │   ├── App.tsx                  # Componente principal
│   │   └── index.tsx               # Entry point
│   ├── package.json                # Dependências frontend
│   └── tsconfig.json               # Configuração TypeScript
├── ⚡ backend/                      # API Node.js
│   ├── src/
│   │   └── index.ts                # Servidor Express
│   ├── package.json                # Dependências backend
│   └── tsconfig.json               # Configuração TypeScript
└── ⛓️ blockchain/                    # Smart contracts
    ├── contracts/
    │   └── KnowledgeRegistry.sol    # Contrato principal
    ├── scripts/
    │   └── deploy.ts               # Script de deploy
    ├── simple-deploy.js            # Deploy simplificado
    ├── hardhat.config.ts           # Configuração Hardhat
    └── package.json                # Dependências blockchain
```

## 🔧 Desenvolvimento

### Scripts Úteis

```bash
# Logs do contêiner
docker logs tkb-container

# Acesso ao contêiner
docker exec -it tkb-container sh

# Logs específicos dos serviços
docker exec tkb-container cat /var/log/supervisor/backend_stdout.log
docker exec tkb-container cat /var/log/supervisor/hardhat.log

# Deploy manual do contrato
docker exec tkb-container sh -c "cd /app/blockchain && npx hardhat run simple-deploy.js --network localhost"

# Teste direto do contrato
docker exec tkb-container sh -c "cd /app/blockchain && npx hardhat run test-contract.js --network localhost"
```

### Dados de Teste

A aplicação vem com dados de teste pré-configurados representando conhecimentos de comunidades tradicionais brasileiras:

1. **Comunidade Kayapó** - Conhecimento sobre plantas medicinais
2. **Comunidade Guarani** - Técnicas tradicionais de plantio  
3. **Comunidade Yanomami** - Uso medicinal de cascas

## 🛠️ Solução de Problemas

### Problemas Comuns

1. **Contrato não encontrado:**
   ```bash
   # Execute o deploy novamente
   docker exec tkb-container sh -c "cd /app/blockchain && npx hardhat run simple-deploy.js --network localhost"
   ```

2. **API retorna erro 503:**
   - Aguarde alguns segundos para o contrato ser deployado
   - Verifique se o Hardhat está rodando: `docker logs tkb-container`

3. **Frontend não carrega:**
   - Verifique se o contêiner está rodando: `docker ps`
   - Acesse diretamente a API: `curl http://localhost:8080/api/hello`

## 📝 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

Para dúvidas, sugestões ou colaborações, abra uma [issue](https://github.com/user/tkb/issues) no repositório.