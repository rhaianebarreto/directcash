# Atualização DirectCA$H — passo a passo para alunas

**Código da atualização: `editor-2026-09-25`**

Inclui duplicação de blocos, emojis nos botões, espera em horas e Automatizar próximo post.

## 1. Preparar o botão de atualização (uma vez)

1. Abra seu repositório do DirectCA$H no GitHub.
2. Abra o arquivo `.github/workflows/atualizar-directcash.yml` e clique no lápis para editar.
3. Copie todo o [código de atualização oficial](https://github.com/rhaianebarreto/directcash/blob/editor-2026-09-25/.github/workflows/atualizar-directcash.yml), substitua o conteúdo do seu arquivo e confirme em **Commit changes**.

Se esse arquivo não existir: **Add file → Create new file**, escreva o nome completo `.github/workflows/atualizar-directcash.yml`, cole o mesmo conteúdo e confirme.

Se em Actions já aparece o campo **Código da atualização recebido no Club**, pule essa preparação.

## 2. Aplicar a atualização

1. No seu repositório, abra **Actions → Atualizar DirectCA$H → Run workflow**.
2. Escolha a branch conectada à Cloudflare (geralmente **main**).
3. No campo do código, coloque **editor-2026-09-25** e confirme **Run workflow**.
4. Aguarde a execução ficar verde.
5. Na sua Cloudflare, abra **Workers e Pages → seu painel → Builds** e aguarde o build desse novo commit terminar com sucesso.
6. Abra o mesmo endereço do seu painel e recarregue.

Para conferir a versão, acrescente `/version.json` ao endereço do painel. Deve aparecer `editor-2026-09-25`.

Se o build não começar: confira em **Configurações → Builds** se o repositório e a branch são os mesmos usados acima. O comando de implantação desta versão é `npm run deploy`. Uma execução verde no GitHub, sozinha, não confirma a publicação na Cloudflare.

**Não precisa reinstalar, criar outro banco ou reconectar o Instagram. Preserve seu Worker, banco, APP_KEY, senha e demais configurações. Cada aluna atualiza sua própria instalação.**

## Usar as novidades

- **Duplicar:** clique em Duplicar no bloco. Conecte a cópia no mapa antes de salvar.
- **Emojis:** clique em 😊 Emojis junto ao texto do botão.
- **Horas:** no bloco Espera, selecione a unidade Horas (até 23 horas).
- **Próximo post:** marque Automatizar próximo post e salve com a automação ativa antes de publicar. Ela aguardará o primeiro post ou Reel publicado após salvar, no perfil selecionado.
