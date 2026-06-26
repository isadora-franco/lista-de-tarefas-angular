# Lista de Tarefas em Angular

Projeto final desenvolvido em Angular com foco em organização de atividades, persistência local e uma interface simples, responsiva e funcional.

## O que o projeto faz

- Permite criar tarefas rapidamente.
- Salva a lista no `localStorage` do navegador.
- Permite marcar tarefas como concluídas.
- Permite editar o texto das tarefas diretamente no card.
- Permite remover uma tarefa individualmente.
- Permite limpar somente as tarefas concluídas.
- Permite apagar toda a lista com confirmação.

## Visão própria adicionada

A proposta adicionada ao projeto foi deixar a lista mais prática para uso diário, mantendo uma experiência direta, organizada e fácil de usar. Além do CRUD básico de tarefas, foram implementados:

- seleção de prioridade ao criar uma tarefa: **Em prazo**, **Hoje** ou **Urgente**;
- cards de resumo com total, pendentes e concluídas;
- filtro por todas, pendentes e concluídas;
- cards de tarefa com destaque visual de prioridade;
- layout responsivo em uma única janela principal;
- visual mais limpo, com foco na organização das tarefas.

## Tecnologias usadas

- Angular 17
- TypeScript
- SCSS
- SweetAlert2
- LocalStorage

## Como rodar o projeto

Depois de baixar ou clonar o projeto, instale as dependências:

```bash
npm install
```

Depois rode o servidor de desenvolvimento:

```bash
ng serve
```

Acesse no navegador:

```bash
http://localhost:4200
```

## Como gerar a versão final

```bash
ng build
```

A pasta final será gerada dentro de `dist/`.
