# 🚀 Sugestões de Melhorias para TKB

Este documento apresenta sugestões de melhorias baseadas na análise das bibliotecas utilizadas e suas documentações atuais.

## 📊 Status das Bibliotecas

### 🔴 Críticas (Ação Imediata Necessária)

#### IPFS-HTTP-Client (Descontinuado)
**Status:** Projeto arquivado em fevereiro de 2024
- **Problema:** Biblioteca descontinuada, sem manutenção ou atualizações futuras
- **Solução:** Migrar para [Helia](https://github.com/ipfs/helia) (sucessor oficial)
- **Impacto:** Segurança e compatibilidade futura comprometidas

**Exemplo de migração:**
```javascript
// Atual (ipfs-http-client)
import { create } from 'ipfs-http-client';
const ipfs = create({ url: 'http://localhost:5001' });

// Novo (Helia)
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
const helia = await createHelia();
const fs = unixfs(helia);
```

### 🟡 Alta Prioridade

#### Hardhat (2.17.0 → 3.x)
**Versão atual:** 2.17.0 → **Disponível:** 3.0.1
- **Benefícios:**
  - Ethereum Development Runtime (EDR) em Rust
  - Performance significativamente melhor
  - Estabilidade aprimorada
  - API estável sem breaking changes
- **Ação:** Atualizar para Hardhat 3.x

#### @nomicfoundation/hardhat-toolbox (3.0.0 → 6.1.0)
- **Melhorias:** Suporte completo para ethers v6, Network Helpers, Hardhat Ignition
- **Dependência:** Atualizar junto com Hardhat 3.x

### 🟠 Média Prioridade

#### Express (4.18.2 → 5.1.0)
**Status:** Express 5.0 oficialmente lançado em outubro 2024
- **Benefícios:**
  - Tratamento automático de erros assíncronos
  - Melhorias de segurança (correções CVE-2024-45590)
  - Suporte nativo para JavaScript moderno
- **Breaking Changes:**
  - Requer Node.js 18+
  - `app.del()` → `app.delete()`
  - `res.sendfile()` → `res.sendFile()`

#### React (18.2.0 → 19.1.0)
**Status:** React 19 lançado em dezembro 2024
- **Novos recursos:**
  - Actions e Async Transitions
  - React Compiler para otimização automática
  - Novos hooks: `useActionState`, `useOptimistic`
  - `ref` como prop (elimina `forwardRef`)
- **Breaking Changes:**
  - `propTypes` removido (migrar para TypeScript)
  - `defaultProps` removido de componentes funcionais
  - Nova JSX Transform obrigatória

### 🟢 Baixa Prioridade (Monitorar)

#### Ethers (5.7.2 → 6.15.0)
**Status:** Migração complexa, v5 ainda recebe patches de segurança
- **Mudanças:** `BigNumber` → `BigInt` nativo, refatoração extensiva necessária
- **Recomendação:** Permanecer na v5.7.2+ até planejar migração cuidadosa

#### CORS (2.8.5)
**Status:** Estável, mas sem atualizações há 7 anos
- **Situação:** Amplamente usado, funcional, mas potenciais riscos de segurança
- **Ação:** Monitorar alternativas modernas

## 🛡️ Melhorias de Segurança

### 1. Tratamento de Erros Aprimorado
```javascript
// backend/src/index.ts - Linha 54
async function connectToContract() {
  try {
    const contractInfo = JSON.parse(await fs.readFile(CONTRACT_INFO_PATH, 'utf8'));
    // ... resto do código
  } catch (error) {
    // ⚠️ Melhorar: Log detalhado de erros
    console.error('Contract connection failed:', {
      error: error.message,
      timestamp: new Date().toISOString(),
      attempt: retryCount
    });
  }
}
```

### 2. Validação de Entrada
```javascript
// Adicionar validação para dados IPFS
app.post('/api/knowledge', async (req, res) => {
  const { ipfsHash, communityId } = req.body;
  
  // Validar formato IPFS hash
  if (!/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(ipfsHash)) {
    return res.status(400).json({ error: 'Invalid IPFS hash format' });
  }
  
  // Validar community ID
  if (!communityId || communityId.length < 3) {
    return res.status(400).json({ error: 'Invalid community ID' });
  }
});
```

### 3. Timeout e Retry Logic
```javascript
// Implementar retry com backoff exponencial
async function connectWithRetry(maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await connectToContract();
      return;
    } catch (error) {
      const delay = Math.pow(2, attempt) * 1000; // Backoff exponencial
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## 🏗️ Melhorias de Arquitetura

### 1. Separação de Responsabilidades
Criar estrutura modular no backend:
```
backend/src/
├── controllers/
│   ├── knowledgeController.ts
│   └── healthController.ts
├── services/
│   ├── blockchainService.ts
│   ├── ipfsService.ts
│   └── contractService.ts
├── middleware/
│   ├── errorHandler.ts
│   └── validation.ts
├── types/
│   └── interfaces.ts
└── utils/
    └── retry.ts
```

### 2. Environment Configuration
```javascript
// config/environment.ts
export const config = {
  port: process.env.PORT || 3001,
  hardhatRpcUrl: process.env.HARDHAT_RPC_URL || 'http://127.0.0.1:8545',
  ipfsUrl: process.env.IPFS_URL || 'http://localhost:5001',
  contractInfoPath: process.env.CONTRACT_INFO_PATH || '../data/contract-info.json'
};
```

### 3. TypeScript Strict Mode
Habilitar configuração mais rigorosa no `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## ⚡ Melhorias de Performance

### 1. React - Otimizações
```tsx
// frontend/src/App.tsx - Implementar memoization
import React, { memo, useMemo, useCallback } from 'react';

const KnowledgeRecord = memo(({ record }: { record: KnowledgeRecord }) => {
  const formattedDate = useMemo(() => 
    new Date(record.timestamp).toLocaleDateString('pt-BR'), 
    [record.timestamp]
  );
  
  return (
    <div>{/* componente otimizado */}</div>
  );
});

const App = () => {
  const fetchRecords = useCallback(async () => {
    // lógica de fetch
  }, []);
  
  // ... resto do componente
};
```

### 2. Caching Estratégico
```javascript
// Implementar cache simples no backend
const cache = new Map();
const CACHE_TTL = 30000; // 30 segundos

app.get('/api/knowledge', async (req, res) => {
  const cacheKey = 'knowledge_records';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }
  
  // Buscar dados frescos...
});
```

## 🧪 Melhorias de Testes

### 1. Estrutura de Testes
```
tests/
├── unit/
│   ├── services/
│   └── controllers/
├── integration/
│   ├── api/
│   └── blockchain/
└── e2e/
    └── flows/
```

### 2. Mock de Dependências Externas
```javascript
// tests/mocks/ipfs.mock.ts
export const mockIPFS = {
  version: jest.fn().mockResolvedValue({ version: '0.60.0' }),
  add: jest.fn().mockResolvedValue({ hash: 'QmTest...' })
};
```

## 📋 Plano de Implementação

### Fase 1: Segurança Crítica (Semana 1)
1. ✅ Migrar IPFS-HTTP-Client para Helia
2. ✅ Implementar validação de entrada
3. ✅ Melhorar tratamento de erros

### Fase 2: Atualizações de Dependências (Semana 2-3)
1. ✅ Atualizar Hardhat 2.17.0 → 3.x
2. ✅ Atualizar hardhat-toolbox 3.0.0 → 6.1.0
3. ✅ Configurar environment variables

### Fase 3: Refatoração Arquitetural (Semana 4-5)
1. ✅ Separar responsabilidades no backend
2. ✅ Implementar TypeScript strict mode
3. ✅ Adicionar estrutura de testes

### Fase 4: Atualizações Maiores (Futuro)
1. 🔄 Planejar migração React 18 → 19
2. 🔄 Planejar migração Express 4 → 5
3. 🔄 Avaliar migração Ethers 5 → 6

## 📚 Recursos Adicionais

- [Helia Documentation](https://github.com/ipfs/helia)
- [Hardhat 3.0 Migration Guide](https://hardhat.org/hardhat-runner/docs/migrate-to-hardhat-3)
- [Express 5.0 Migration Guide](https://expressjs.com/en/guide/migrating-5.html)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

---

**Nota:** Este documento deve ser revisado mensalmente para manter as recomendações atualizadas conforme o lançamento de novas versões das bibliotecas.