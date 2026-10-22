# Como subir

1. No repositório `eoBottino/eoBottino`, apague `assets/` e qualquer `.github/` que tenha subido antes.
2. Copie para a raiz: `README.md`, `assets/`, `tools/`, `package.json`.
3. Pronto. Não há Actions, tokens, branches extras nem serviços externos.

Para editar textos, cores ou animações: altere `tools/*.mjs` e rode `node tools/build-assets.mjs`
(cores em `tools/svg.mjs`, objeto `C`). O texto do console e do pipeline é ilustrativo.
