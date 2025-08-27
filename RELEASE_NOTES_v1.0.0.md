## 🎉 TKB v1.0.0 - Traditional Knowledge Blockchain

### 🚀 Principais Recursos

- ✅ **Smart Contract** completo para registro de conhecimento tradicional
- ✅ **Frontend React** moderno e responsivo com interface amigável
- ✅ **Backend Node.js** com APIs RESTful para interação blockchain
- ✅ **IPFS** para armazenamento descentralizado de documentos
- ✅ **Docker** containerizado single-container para fácil deploy
- ✅ **Multi-arquitetura** (linux/amd64, linux/arm64)
- ✅ **CI/CD** automatizado com GitHub Actions

### 🔧 Como Usar

#### Opção 1: Imagem Docker (Recomendado)
```bash
docker run -d -p 8080:3001 --name tkb-container ghcr.io/edalcin/tkb:v1.0.0
docker exec tkb-container sh -c "cd /app/blockchain && npx hardhat run simple-deploy.js --network localhost"
```

#### Opção 2: Build Local
```bash
git clone https://github.com/edalcin/tkb.git
cd tkb
docker build -t tkb-app .
docker run -d -p 8080:3001 --name tkb-container tkb-app
```

### 🏗️ Stack Tecnológico

- **Frontend:** React 18 + TypeScript
- **Backend:** Node.js 18 + Express.js
- **Blockchain:** Hardhat + Solidity ^0.8.19
- **Storage:** IPFS Kubo v0.21.0
- **Container:** Docker + Supervisor
- **CI/CD:** GitHub Actions

### 📦 Artefatos

- **Docker Image:** `ghcr.io/edalcin/tkb:v1.0.0`
- **Source Code:** Disponível como ZIP/TAR.GZ
- **Arquiteturas:** linux/amd64, linux/arm64
- **Registry:** GitHub Container Registry

### 🧪 Dados de Teste

A aplicação inclui dados de exemplo de comunidades tradicionais brasileiras:
- **Comunidade Kayapó** - Conhecimento sobre plantas medicinais
- **Comunidade Guarani** - Técnicas tradicionais de plantio  
- **Comunidade Yanomami** - Uso medicinal de cascas

### 📋 Funcionalidades Implementadas

#### Smart Contract (KnowledgeRegistry)
- ✅ Função `registerKnowledge()` para novos registros
- ✅ Função `getAllRecords()` para consulta de dados
- ✅ Eventos `KnowledgeRegistered` para auditoria
- ✅ Estrutura completa de dados (ID, IPFS hash, comunidade, timestamp)

#### API Backend
- ✅ `GET /api/hello` - Status da aplicação
- ✅ `GET /api/knowledge` - Lista conhecimentos registrados
- ✅ Conexão automática com smart contract
- ✅ Integração IPFS para armazenamento

#### Interface Frontend
- ✅ Dashboard principal com visualização de registros
- ✅ Cards responsivos para cada conhecimento
- ✅ Botões de teste e conectividade
- ✅ Informações detalhadas (comunidade, responsável, data, IPFS hash)

### 🔧 Requisitos do Sistema

- **Docker:** 20.10+
- **RAM:** 2GB mínimo
- **Storage:** 1GB disponível
- **Network:** Porta 8080 disponível
- **OS:** Linux, macOS, Windows (com Docker Desktop)

### 🔗 Links e Recursos

- **Frontend:** http://localhost:8080
- **API:** http://localhost:8080/api/knowledge
- **Status:** http://localhost:8080/api/hello
- **Documentação:** [README.md](https://github.com/edalcin/tkb/blob/v1.0.0/README.md)
- **Issues:** [GitHub Issues](https://github.com/edalcin/tkb/issues)
- **Releases:** [All Releases](https://github.com/edalcin/tkb/releases)

### 🛠️ Para Desenvolvedores

```bash
# Clone e desenvolvimento local
git clone https://github.com/edalcin/tkb.git
cd tkb

# Build e execução
docker build -t tkb-dev .
docker run -d -p 8080:3001 --name tkb-dev tkb-dev

# Deploy do contrato
docker exec tkb-dev sh -c "cd /app/blockchain && npx hardhat run simple-deploy.js --network localhost"

# Logs e debugging
docker logs tkb-dev
docker exec -it tkb-dev sh
```

### 🚀 Próximos Passos (Roadmap)

- [ ] Interface para registro de novos conhecimentos
- [ ] Sistema de autenticação de comunidades
- [ ] Upload de arquivos para IPFS via frontend
- [ ] API para busca e filtros avançados
- [ ] Notificações de novos registros
- [ ] Dashboard de estatísticas

### 🤝 Contribuições

Este é um projeto open-source! Contribuições são bem-vindas:

1. Fork do repositório
2. Criar feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit das mudanças (`git commit -m 'Adicionar nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abrir Pull Request

### 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

**🤖 Release automática gerada pelo pipeline CI/CD**
**📅 Data:** Agosto 2025
**👥 Mantido por:** @edalcin
**🌱 Projeto TKB - Protegendo o conhecimento tradicional com tecnologia blockchain**