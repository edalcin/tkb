# 🏷️ Guia de Release

## Como Criar uma Nova Release

### 1. Preparação da Release

1. **Certifique-se de que a branch `main` está estável:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Verifique se todos os testes estão passando:**
   - GitHub Actions: ✅ Build and Deploy
   - GitHub Actions: ✅ Update Package Metadata

### 2. Criando a Release via GitHub Web

1. **Acesse:** https://github.com/edalcin/tkb/releases
2. **Clique em:** "Create a new release"
3. **Configure a tag:** 
   - Format: `v1.0.0` (seguindo Semantic Versioning)
   - Target: `main` branch
4. **Título da Release:** `v1.0.0 - Nome da Release`
5. **Descrição:** Use o template abaixo

### 3. Template de Descrição da Release

```markdown
## 🎉 TKB v1.0.0 - Traditional Knowledge Blockchain

### 🚀 Principais Recursos

- ✅ **Smart Contract** completo para registro de conhecimento tradicional
- ✅ **Frontend React** moderno e responsivo
- ✅ **Backend Node.js** com APIs RESTful
- ✅ **IPFS** para armazenamento descentralizado
- ✅ **Docker** containerizado single-container
- ✅ **Multi-arquitetura** (AMD64/ARM64)

### 🔧 Como Usar

#### Opção 1: Imagem Docker (Recomendado)
\`\`\`bash
docker run -d -p 8080:3001 --name tkb-container ghcr.io/edalcin/tkb:v1.0.0
docker exec tkb-container sh -c "cd /app/blockchain && npx hardhat run simple-deploy.js --network localhost"
\`\`\`

#### Opção 2: Build Local
\`\`\`bash
git clone https://github.com/edalcin/tkb.git
cd tkb
docker build -t tkb-app .
docker run -d -p 8080:3001 --name tkb-container tkb-app
\`\`\`

### 📦 Artefatos

- **Docker Image:** \`ghcr.io/edalcin/tkb:v1.0.0\`
- **Source Code:** Disponível como ZIP/TAR.GZ
- **Arquiteturas:** linux/amd64, linux/arm64

### 🧪 Dados de Teste

A aplicação inclui dados de exemplo de comunidades tradicionais brasileiras:
- Comunidade Kayapó
- Comunidade Guarani  
- Comunidade Yanomami

### 📋 Requisitos

- Docker 20.10+
- 2GB RAM mínimo
- Porta 8080 disponível

### 🔗 Links Úteis

- **Frontend:** http://localhost:8080
- **API:** http://localhost:8080/api/knowledge
- **Documentação:** [README.md](https://github.com/edalcin/tkb/blob/main/README.md)
- **Issues:** [GitHub Issues](https://github.com/edalcin/tkb/issues)

---
🤖 Gerado automaticamente pelo pipeline CI/CD
```

### 4. Criando Release via CLI (Alternativo)

```bash
# Instalar GitHub CLI se necessário
# gh auth login

# Criar release
gh release create v1.0.0 \
  --title "v1.0.0 - Traditional Knowledge Blockchain" \
  --notes-file RELEASE_NOTES.md \
  --generate-notes
```

### 5. Após Publicar a Release

1. **Workflow Automático:** O workflow `release.yml` será acionado automaticamente
2. **Builds Multi-arquitetura:** AMD64 e ARM64 serão construídas
3. **Tags Docker:** Serão criadas automaticamente:
   - `ghcr.io/edalcin/tkb:v1.0.0`
   - `ghcr.io/edalcin/tkb:v1.0`
   - `ghcr.io/edalcin/tkb:v1`
   - `ghcr.io/edalcin/tkb:stable`

### 6. Verificação Pós-Release

1. **GitHub Actions:** Verifique se o workflow de release foi executado com sucesso
2. **Container Registry:** Confirme se as imagens foram publicadas
3. **Badges:** Os badges no README.md serão atualizados automaticamente
4. **Teste:** Execute a nova versão para validar

```bash
# Testar a nova release
docker run -d -p 8080:3001 --name tkb-test ghcr.io/edalcin/tkb:v1.0.0
```

## 🔄 Semantic Versioning

- **MAJOR** (v2.0.0): Breaking changes
- **MINOR** (v1.1.0): New features, backward compatible
- **PATCH** (v1.0.1): Bug fixes, backward compatible

## 📝 Checklist de Release

- [ ] Todos os testes passando
- [ ] Documentação atualizada
- [ ] CHANGELOG.md atualizado (se aplicável)
- [ ] Tag criada seguindo semver
- [ ] Release notes completas
- [ ] Imagens Docker publicadas
- [ ] Verificação pós-release realizada