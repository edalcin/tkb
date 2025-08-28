# Estrutura do Contrato Inteligente

Este documento detalha a estrutura de dados e as funcionalidades do contrato inteligente `TraditionalKnowledgeRegistry`, que é o coração da plataforma TKB.

## Definições dos Dados

Os dados são armazenados em uma `struct` chamada `TraditionalKnowledgeRecord`, que contém as seguintes informações:

### 1. Identificação da Espécie
- **scientificName**: Nome científico da espécie (ex: "Curcuma longa").
- **commonName**: Nome(s) popular(es) na comunidade (ex: "Açafrão-da-terra", "Cúrcuma").
- **speciesType**: Tipo (ex: "Planta", "Animal", "Fungo").
- **habitat**: Onde a espécie é encontrada (ex: "Floresta Amazônica", "Cerrado", "Mangue").

### 2. Uso Tradicional
- **useTo**: Categoria de uso (ex: "Medicinal", "Alimentar", "Artesanal", "Ritualístico", "Construção").
- **partsUsed**: Partes da espécie utilizadas (ex: "Raiz", "Folha", "Fruto", "Casca", "Flor", "Animal Inteiro", "Pele", "Osso").
- **preparationMethods**: Métodos de preparo (ex: "Chá", "Infusão", "Decocção", "Pomada", "In natura", "Secagem", "Fermentação").
- **useToRemarks**: Detalhes do uso (ex: "Dor de cabeça", "Construção de canoas", "Extração de tinta").
- **traditionalRecipeHash**: Hash IPFS para uma receita ou instruções detalhadas de uso.
- **culturalSignificanceHash**: Hash IPFS para uma descrição da importância cultural ou histórias associadas.

### 3. Informações da Comunidade
- **communityId**: Identificador único da comunidade.
- **communityName**: Nome da comunidade (ex: "Comunidade Indígena Xingu", "Quilombo do Cafundó").
- **communityLocationHash**: Hash IPFS para informações de localização ou mapa da comunidade (se for público e consentido).
- **communityContactAddress**: Endereço de uma carteira que representa a comunidade para contato ou governança.

### 4. Atribuição e Proveniência
- **contributorAddress**: Endereço da carteira da pessoa ou entidade que submeteu o conhecimento.
- **dateRecorded**: Data em que o conhecimento foi registrado no contrato.
- **lastUpdated**: Data da última atualização do registro.
- **verificationStatus**: Status de verificação (ex: "Pendente", "Verificado pela Comunidade", "Validado por Especialista").

### 5. Propriedade Intelectual e Acesso
- **accessPermissions**: Nível de acesso (ex: "Público", "Restrito à Comunidade", "Apenas com Permissão"). 
- **licensingInformationHash**: Hash IPFS para informações sobre licenciamento ou termos de uso do conhecimento.

### 6. Validadores
- **validatorId**: Endereço da carteira da pessoa que tem direito de validar o conhecimento, alterando o `verificationStatus`.

## Funcionalidades (Funções)

- `addTraditionalKnowledge(...)`: Para registrar um novo conhecimento sobre uma espécie.
- `updateTraditionalKnowledge(...)`: Para permitir que entidades autorizadas (ex: o contribuidor original, um líder da comunidade) atualizem registros existentes.
- `getKnowledgeBySpecies(...)`: Para buscar todos os registros de conhecimento relacionados a uma espécie específica.
- `getKnowledgeByCommunity(...)`: Para buscar todos os registros de conhecimento contribuídos por uma comunidade específica.
- `verifyKnowledge(...)`: Uma função para membros da comunidade ou validadores designados atestarem a precisão ou autenticidade de um registro de conhecimento.
- `proposeEdit(...)`: Um mecanismo para que outros possam propor edições ou adições ao conhecimento existente, que precisariam de aprovação.
- `grantAccess(...)`: Se o acesso for restrito, uma função para conceder permissões de visualização.
- `transferOwnership(...)`: Se a "propriedade" de um registro de conhecimento puder ser transferida (ex: de um indivíduo para um coletivo da comunidade).

## Eventos

- `KnowledgeRegistered`: Emitido quando um novo conhecimento é registrado.
- `KnowledgeUpdated`: Emitido quando um registro é atualizado.
- `KnowledgeVerified`: Emitido quando um registro é verificado.
- `AccessGranted`: Emitido quando o acesso a um registro restrito é concedido.
