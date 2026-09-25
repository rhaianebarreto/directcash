# Atualização DirectCA$H — passo a passo para alunas

**Código da atualização: `editor-2026-09-25-r5`**

Inclui duplicação de blocos, emojis nos botões, espera em horas e Automatizar próximo post.

## 1. Preparar o botão de atualização (uma vez)

1. Abra seu repositório do DirectCA$H no GitHub.
2. Abra o arquivo `.github/workflows/atualizar-directcash.yml` e clique no lápis para editar.
3. Copie todo o [código de atualização oficial](https://github.com/rhaianebarreto/directcash/blob/editor-2026-09-25-r5/.github/workflows/atualizar-directcash.yml), substitua o conteúdo do seu arquivo e confirme em **Commit changes**.

Se esse arquivo não existir: **Add file → Create new file**, escreva o nome completo `.github/workflows/atualizar-directcash.yml`, cole o mesmo conteúdo e confirme.

Se você já instalou a revisão `editor-2026-09-25-r2` com o código de atualização daquela revisão, pode pular essa preparação. Nas versões anteriores, substitua o arquivo conforme acima para aceitar o código com `-r5`.

## 2. Aplicar a atualização

1. No seu repositório, abra **Actions → Atualizar DirectCA$H → Run workflow**.
2. Escolha a branch conectada à Cloudflare (geralmente **main**).
3. No campo do código, coloque **editor-2026-09-25-r5** e confirme **Run workflow**.
4. Aguarde a execução ficar verde.
5. Na sua Cloudflare, abra **Workers e Pages → seu painel → Builds** e aguarde o build desse novo commit terminar com sucesso.
6. Abra o mesmo endereço do seu painel e recarregue.

Para conferir a versão, acrescente `/version.json` ao endereço do painel. Deve aparecer `editor-2026-09-25-r5`.

Se o build não começar: confira em **Configurações → Builds** se o repositório e a branch são os mesmos usados acima. O comando de implantação desta versão é `npm run deploy`. Uma execução verde no GitHub, sozinha, não confirma a publicação na Cloudflare.

**Não precisa reinstalar, criar outro banco ou reconectar o Instagram. Preserve seu Worker, banco, APP_KEY, senha e demais configurações. Cada aluna atualiza sua própria instalação.**

## Usar as novidades

- **Duplicar:** clique em Duplicar no bloco. Conecte a cópia no mapa antes de salvar.
- **Emojis:** clique em 😊 Emojis junto ao texto do botão.
- **Horas:** no bloco Espera, selecione a unidade Horas (até 23 horas).
- **Próximo post:** marque Automatizar próximo post e salve com a automação ativa antes de publicar. Ela aguardará o primeiro post ou Reel publicado após salvar, no perfil selecionado.

## Novidade desta revisão: ação dos botões

1. Abra Fluxos e edite o bloco de mensagem.
2. Em Botões desta mensagem, preencha o texto e escolha Ao clicar.
3. Escolha Ir para o próximo passo e selecione o bloco de destino, ou Abrir um link e cole o endereço HTTPS.
4. Salve o fluxo.

Você pode combinar as duas ações em uma mensagem de até três botões. Botões de link abrem o endereço; não acionam outro passo do fluxo. Quando a mensagem tem somente botões de link, use Continuar após esta mensagem ou a saída Próximo passo no mapa. Ao trocar a única resposta por link, sua conexão é preservada como continuação do bloco. Se há várias respostas com caminhos diferentes, adicione o link como outro botão para preservar esses caminhos.

## Conectar uma mensagem com link

No mapa, localize a faixa **Saída da caixa**, abaixo do botão de link. Arraste a bolinha dourada dessa faixa até a entrada da próxima caixa. Também pode clicar na bolinha e depois na entrada da caixa de destino. Salve o fluxo. O botão de link continua abrindo seu endereço. Se a mensagem também tiver botões de resposta, conecte os caminhos dessas respostas.
