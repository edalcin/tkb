# Instruções de Instalação no Unraid

Este guia descreve como instalar a aplicação TKB como um contêiner Docker customizado no Unraid usando a imagem oficial automaticamente construída.

> **ℹ️ Imagem Oficial**: A imagem Docker é construída automaticamente pelo GitHub Actions a cada atualização do código e está disponível no GitHub Container Registry.

## Passo 1: Instalar o Contêiner no Unraid

1.  **Vá para a aba "Apps" no Unraid.**
    -   Procure e instale o template "Docker Custom" ou "Custom Docker App" se ainda não o tiver.

2.  **Adicione um Novo Contêiner.**
    -   Vá para a aba **DOCKER** no Unraid.
    -   Clique em **ADD CONTAINER**.
    -   Selecione o template para um contêiner customizado.

3.  **Configure o Template do Contêiner TKB:**

    -   **Name:** `TKB-App` (ou o nome que preferir).
    -   **Repository:** `ghcr.io/edalcin/tkb:latest` (imagem oficial construída automaticamente).
    -   **Network Type:** `Bridge`.
    -   **WebUI:** `http://[IP]:[PORT_8080]` (Isso criará um atalho na interface do Unraid).

4.  **Configure as Portas:**
    -   Clique em **Add another Path, Port, Variable, Label or Device**.
    -   **Config Type:** `Port`.
    -   **Name:** `Web Interface`.
    -   **Container Port:** `3001` (Esta é a porta que a API do backend expõe dentro do contêiner).
    -   **Host Port:** `8080` (ou outra porta livre no seu Unraid que você queira usar para acessar a aplicação).

5.  **Configure os Volumes (Paths):**
    -   A aplicação usa múltiplos diretórios para dados persistentes. Configure todos os volumes abaixo:
    
    **Volume 1 - Dados IPFS:**
    -   Clique em **Add another Path, Port, Variable, Label or Device**.
    -   **Config Type:** `Path`.
    -   **Name:** `IPFS Data`.
    -   **Container Path:** `/data/ipfs`.
    -   **Host Path:** `/mnt/user/appdata/tkb/ipfs-data/`.
    
    **Volume 2 - Dados da Aplicação:**
    -   Clique em **Add another Path, Port, Variable, Label or Device**.
    -   **Config Type:** `Path`.
    -   **Name:** `Application Data`.
    -   **Container Path:** `/app/data`.
    -   **Host Path:** `/mnt/user/appdata/tkb/app-data/`.
    
    **Volume 3 - Logs do Sistema:**
    -   Clique em **Add another Path, Port, Variable, Label or Device**.
    -   **Config Type:** `Path`.
    -   **Name:** `System Logs`.
    -   **Container Path:** `/var/log/supervisor`.
    -   **Host Path:** `/mnt/user/appdata/tkb/logs/`.

    > **⚠️ Importante:** Todos os três volumes são essenciais:
    > - **IPFS Data**: Armazena dados descentralizados (metadados, arquivos)
    > - **Application Data**: Contém informações dos contratos blockchain (`contract-info.json`)
    > - **System Logs**: Logs para debugging e monitoramento do sistema

6.  **Aplique e Inicie.**
    -   Clique em **APPLY** para salvar o template e iniciar o contêiner.

## Passo 2: Acessar a Aplicação

Após o contêiner iniciar, você poderá acessar a interface web da aplicação TKB através do endereço do seu servidor Unraid na porta que você configurou (ex: `http://192.168.1.100:8080`).

## Atualizações Automáticas

A imagem `ghcr.io/edalcin/tkb:latest` é atualizada automaticamente a cada push no branch main do repositório. Para obter a versão mais recente:

1. **Para atualizações manuais**: No Unraid, vá para a aba DOCKER, clique no contêiner TKB e selecione "Force Update"
2. **Para uma versão específica**: Substitua `:latest` por uma tag de versão específica (ex: `:v1.0.0`) no campo Repository
