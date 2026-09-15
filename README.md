<!-- DIRECTCASH-BROWSER-START -->
## Instalar pelo navegador (celular ou computador)

[Instalar meu DirectCA$H](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Frhaianebarreto%2Fdirectcash)

Use contas Cloudflare e GitHub. Informe uma senha privada ADMIN_PASSWORD e uma chave aleatória APP_KEY (32 caracteres ou mais); mantenha o comando npm run deploy. Depois abra seu endereço workers.dev. Consulte INSTALAR-PELO-CELULAR.md.
<!-- DIRECTCASH-BROWSER-END -->

# DirectCA$H · Creator IA Club

Edição 1.1 de instalação individual para Cloudflare Workers + D1. Código novo, sem arquivos do DirectPro/MANY. A imagem de marca foi fornecida pela responsável pelo Creator IA Club.

## Para instalar

1. Instale Node.js LTS e extraia o ZIP.
2. Windows: abra `INSTALAR-WINDOWS.cmd`. macOS/Linux: `npm ci`, depois `npm run install:guided`.
3. O assistente pede autorização, cria D1, aplica o schema e publica na sua conta Cloudflare. Não contrata um plano pago.
4. Guarde a senha. No site publicado, abra **Configuração** e **Guia de instalação** para preparar a Meta.
5. Após conectar o Instagram, cole a licença recebida na seção **Sua licença**. O perfil é vinculado automaticamente, até o limite definido pela responsável. A validade começa na primeira ativação e é comum a todos os perfis. Para vários perfis simultâneos, use uma instalação por perfil com a mesma licença.

O guia completo está em `public/guia.html` e publicado em `/guia.html`. É necessário Node compatível com a versão de Wrangler fixada no package-lock.json.

## O que esta versão faz

- Uma conta profissional do Instagram por instalação; sem clientes compartilhando um banco.
- Licenças online verificadas no servidor central LIVE CA$H, vinculadas ao identificador Instagram. Não inclui o segredo administrativo do servidor.
- Login administrativo por senha aleatória e sessão de 24h.
- Cadastro/edição/pausa/exclusão de até 30 automações, com modelos de material, aula e oferta.
- Comentário com palavra-chave em post específico → uma mensagem privada com link HTTPS em texto → resposta pública opcional.
- DM recebida com palavra-chave → resposta com link dentro da janela permitida.
- Webhooks assinados, deduplicação persistente, fila no D1, lotes de até quatro envios e rotina a cada cinco minutos.
- Renovação de token próximo ao vencimento, status, diagnóstico e histórico com retenção de 30 dias.

Não inclui editor visual de fluxos, sequências, botões na mensagem, pagamento, disparos em massa, captura de e-mails ou IA generativa. Não é uma cópia funcional completa do DirectPro. O link vai diretamente no primeiro texto privado.

## Segurança e limites

- APP_KEY e ADMIN_PASSWORD são secrets do Worker; o instalador mantém cópia privada em `.install-secrets.json`. Não distribua sua pasta instalada.
- Chave do aplicativo Meta e token são criptografados no D1 (AES-GCM). APP_KEY não deve ser perdida ou substituída sem reconectar as contas.
- Cookies HttpOnly/SameSite, verificação de Origin nas alterações, token OAuth de uso único vinculado à sessão e rate limit de login.
- Eventos próprios, ecos, replies em threads e Lives são ignorados. Uma regra por evento; regras mais antigas têm prioridade em sobreposição.
- Uma resposta privada por comentário, expira após sete dias do timestamp do evento Meta. DM expira 24h após o timestamp recebido. Esta edição não envia follow-up.
- Resultado desconhecido de envio é marcado incerto e não é repetido automaticamente para evitar duplicações. Falhas conhecidas também exigem novo teste após correção. Não há garantia de entrega.
- Limite local conservador de 60 operações aceitas/incertas por hora; não representa a cota oficial da Meta. Conexões simultâneas podem ultrapassar levemente esse limite local; limites da Meta continuam sendo aplicados pela plataforma.
- Jobs pendentes são cancelados ao pausar a regra no próximo dreno. Um envio já em andamento pode concluir.
- O uso real precisa caber nos limites de CPU, solicitações, banco e armazenamento do plano Free. O kit não cria serviços pagos; ao atingir limites, o serviço pode falhar.
- Licenças são verificadas na ativação e depois com cache de até cinco minutos. Suspensão/removal no servidor bloqueia os próximos envios após o cache vencer; envio em andamento pode concluir. Falhas de rede após o cache vencer também bloqueiam os envios. Quem controla o código e a hospedagem ainda pode remover a verificação; não é proteção inviolável.
- Em produção, mantenha o contato da página de privacidade atualizado e atenda pedidos de exclusão. Para excluir dados de um participante, use consultas parametrizadas no D1 ou a opção de apagar todo o histórico no painel. Backups seguem as políticas da Cloudflare.

## Desenvolvimento local

```
npm ci
```

Copie `.dev.vars.example` para `.dev.vars` (somente desenvolvimento local). Depois:

```
npm run types
npm run db:local
npm run dev
```

Abra o endereço exibido. Credenciais fictícias servem apenas para testar telas. OAuth e eventos reais exigem um endereço público e configuração Meta válida.

## Verificação e publicação manual

```
npm run types
npm run check
npm test
npx wrangler deploy --dry-run
```

Para publicação manual: crie um D1, substitua o ID e nome em wrangler.jsonc, aplique `npm run db:remote`, publique com `npm run deploy` e registre APP_KEY e ADMIN_PASSWORD com `wrangler secret put`. Sem esses secrets, a API retorna instalação incompleta.

## Antes de distribuir às alunas

Valide a publicação em sua conta, o OAuth e um envio real com outra conta de teste, inclusive deduplicação e pausa. Faça o teste de público real após obter os níveis de acesso exigidos pela Meta. Instalação própria não elimina automaticamente App Review ou verificação de negócio.

## Fontes técnicas

- https://developers.cloudflare.com/workers/best-practices/workers-best-practices/
- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/d1/worker-api/prepared-statements/
- https://developers.cloudflare.com/workers/wrangler/commands/
- https://www.postman.com/meta/instagram/folder/1z5vxzu/instagram-api-with-instagram-login

Nenhum aplicativo, hospedagem ou assinatura é provisionado simplesmente ao baixar o kit. O instalador realiza ações somente quando executado pela titular da conta.

## Licenciamento central — versão 1.1

O servidor `https://livecash-license-server.suporterhaianebarreto.workers.dev` precisa receber primeiro a atualização DirectCA$H e a tabela isolada `directcash_licenses`. A responsável emite as licenças na quarta aba do painel existente. As alunas só recebem códigos `DC-...`, nunca ADMIN_SECRET.

Este kit substitui o formato offline da versão 1.0. Licenças assinadas antigas não são aceitas; emita uma licença no painel central. O emissor privado offline da versão 1.0 não é usado aqui.

Na validação são enviados código de licença e identificador Instagram, sem token Meta, comentários ou mensagens. O servidor central armazena nome/e-mail informados pela responsável, ID Instagram, validade e último acesso. O serviço central precisa permanecer disponível, e suas requisições contam nas cotas Cloudflare da responsável.
