# Central DirectCash — piloto local de 14/10/2026

Versão preparada para publicação: editor-2026-10-14. Testes de autorização em conta nova continuam pendentes.

## Testar a interface
Abra /central.html no servidor local. A página oferece instalação nova, atualização e diagnóstico. O instalador existente continua em /instalar.html. O teste local gera credenciais fictícias no navegador, sem instalar na Cloudflare.

## Atualizador
O arquivo .github/workflows/atualizar-directcash.yml aceita recomendado (padrão) ou um código de versão explícito. A recomendação vem de public/updates.json no main oficial. O manifesto recomenda editor-2026-10-14; publicar main e a tag na mesma operação.
public/atualizar-directcash.yml deve ser uma cópia idêntica do workflow. Instalações antigas precisam substituir o workflow uma vez. Futuras atualizações não pedem códigos. O workflow não copia configurações do distribuidor nem altera segredos. Ele salva ajustes de estrutura no wrangler.jsonc da aluna preservando nome/banco/variáveis.

## Antes de distribuir
1. Fazer backup dos fluxos da instalação de teste.
2. Publicar uma versão candidata e os arquivos da central, sem mudar a recomendação estável antes de testar.
3. Usar uma conta de teste com GitHub e Cloudflare autorizados pelo titular. Concluir Deploy to Cloudflare, verificar criação do banco e migrações, senha e painel.
4. Na instalação antiga de teste, instalar o workflow uma vez e executar com o código explícito da candidata. Conferir sucesso no GitHub e no build Cloudflare, identidade do banco, fluxos e conexão preservados.
5. Conectar o Instagram de teste e realizar um comentário autorizado. Confirmar fila e resultado na Meta.
6. Apenas após esses testes, promover a versão recomendada em public/updates.json. O código desta versão é editor-2026-10-14.

## Validação concluída localmente
- Central em 390 e 1280 pixels, sem transbordamento horizontal; links GitHub validados.
- Geração local de credenciais e link de instalação.
- Atualizador de configuração executado duas vezes preservando nome, banco e variáveis.
- Testes de 126 regras, backup, filas, pausa por rate limit e ausência de reenvio incerto.
- Consulta de dependência de mensagem: 2.006 leituras → 7 com 2.000 envios históricos. Isso mede essa consulta, não o consumo total de uma automação.

## Capacidade
Não há consumo ilimitado gratuito. D1 Free: 5 milhões de linhas lidas e 100 mil escritas/dia por conta, conforme documentação consultada em 14/10/2026. Ao esgotar a cota as consultas falham. A fila usa D1, portanto não consegue registrar novos itens quando esse banco está bloqueado. Verificar erros e métricas da instalação afetada antes de atribuir a falha à cota. Não reenviar mensagens de resultado incerto.
Fontes: https://developers.cloudflare.com/d1/platform/pricing/ e https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/
