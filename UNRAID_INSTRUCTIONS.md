# Instruções de Instalação no Unraid

Este guia descreve como instalar a aplicação TKB como um contêiner Docker customizado no Unraid.

## Passo 1: Construir a Imagem Docker

Primeiro, você precisa ter acesso a um terminal com Docker para construir a imagem da aplicação. Esta imagem pode ser construída em sua máquina local e depois enviada para um registro de contêineres (como o Docker Hub), ou você pode usar o terminal do próprio Unraid se ele tiver as ferramentas de build.

1.  Clone o repositório do projeto:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_GIT>
    ```
2.  Navegue até o diretório do projeto e construa a imagem:
    ```bash
    cd tkb
    docker build -t seu-usuario/tkb-app:latest .
    ```
    *Substitua `seu-usuario` pelo seu nome de usuário no Docker Hub.*

3.  Envie a imagem para o Docker Hub:
    ```bash
    docker push seu-usuario/tkb-app:latest
    ```

## Passo 2: Instalar o Contêiner no Unraid

1.  **Vá para a aba "Apps" no Unraid.**
    -   Procure e instale o template "Docker Custom" ou "Custom Docker App" se ainda não o tiver.

2.  **Adicione um Novo Contêiner.**
    -   Vá para a aba **DOCKER** no Unraid.
    -   Clique em **ADD CONTAINER**.
    -   Selecione o template para um contêiner customizado.

3.  **Configure o Template do Contêiner TKB:**

    -   **Name:** `TKB-App` (ou o nome que preferir).
    -   **Repository:** `seu-usuario/tkb-app:latest` (a imagem que você enviou no Passo 1).
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

## Passo 3: Acessar a Aplicação

Após o contêiner iniciar, você poderá acessar a interface web da aplicação TKB através do endereço do seu servidor Unraid na porta que você configurou (ex: `http://192.168.1.100:8080`).
