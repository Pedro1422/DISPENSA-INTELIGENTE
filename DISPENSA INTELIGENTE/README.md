# Despensa Inteligente

Trabalho final da disciplina Introdução ao Desenvolvimento para Dispositivos Móveis, Afya Centro Universitário Ji-Paraná, sob orientação do professor Romário Vitorino Ferreira.

## Descrição inicial do problema

Muitas famílias perdem o controle do que têm em casa. Alimentos e produtos de higiene acabam sem que ninguém perceba, e só se descobre a falta na hora de usar. Isso leva a compras feitas às pressas, à repetição de itens que ainda estavam em estoque e a gastos maiores do que o necessário, já que o preço do mesmo produto varia bastante entre os mercados e raramente existe tempo para comparar um a um.

## Objetivo

Desenvolver uma aplicação web, pensada para o uso em dispositivos móveis, que ajude o usuário a acompanhar o estoque da sua despensa e a decidir onde comprar o que está faltando pagando menos. O projeto também serve para praticar os fundamentos do desenvolvimento web: HTML, CSS e JavaScript puro, manipulação do DOM, tratamento de datas e armazenamento local no navegador.

## Funcionalidades previstas

A aplicação terá cinco funcionalidades principais, divididas em dois módulos. No módulo de gestão da despensa, o usuário cadastra cada produto informando a duração estimada em dias; o sistema calcula quando o item termina e o marca com o status "Acabando" quando restarem dois dias ou menos; e, ao repor o produto, basta usar o botão "Comprei de novo" para reiniciar a contagem. No módulo otimizador de compras, o usuário informa o preço dos itens a comprar em até três mercados; a aplicação indica qual é o melhor mercado único para levar tudo, ou seja, o de menor custo total; e monta uma cesta otimizada, escolhendo para cada item o mercado mais barato. Os dados ficam salvos no `localStorage` do navegador, e o código usa `Date`, `filter`, `map` e `reduce` para os cálculos e as listagens.

## Integrantes

Pedro Paulo Soares e Maike Barros.

## Divisão preliminar das responsabilidades

A divisão abaixo é inicial e pode ser ajustada ao longo do desenvolvimento. Pedro Paulo Soares fica responsável pela estrutura da página em `index.html`, pela organização do repositório e pelo módulo de gestão da despensa em `js/app.js`, incluindo cadastro, cálculo de dias restantes, status "Acabando" e o botão "Comprei de novo". Maike Barros cuida do visual e da responsividade em `css/style.css` e desenvolve o otimizador de compras, com a comparação entre os três mercados, o melhor mercado único e a cesta otimizada, além da persistência no `localStorage`. Os dois participam dos testes e da revisão final, e a documentação, incluindo este README, é mantida em conjunto.

## Estrutura

```
DISPENSA INTELIGENTE/
├── README.md
├── index.html
├── service-worker.js
├── css/
│   └── style.css
├── data/
│   └── dados.json
└── js/
    ├── app.js
    ├── armazenamento.js
    ├── estado.js
    ├── interface.js
    ├── navegacao.js
    ├── otimizador.js
    └── validacao.js
```
```

## Tecnologias

HTML, CSS e JavaScript puro, sem frameworks, com armazenamento em `localStorage`.

## Login demonstrativo

A aplicação inclui uma tela de login apenas para demonstração visual. Não há autenticação real: os dados digitados não são enviados nem armazenados, e o acesso às funcionalidades continua disponível sem uma conta.