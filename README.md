# MuleAcademy

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-34d399?style=for-the-badge)
![Frontend](https://img.shields.io/badge/frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-38bdf8?style=for-the-badge)
![Projeto](https://img.shields.io/badge/projeto-curso%20interativo-8b5cf6?style=for-the-badge)

Uma plataforma didática, interativa e gamificada para ensinar fundamentos de integração de sistemas, APIs, formatos de dados e conceitos de MuleSoft para iniciantes em tecnologia.

O projeto combina aulas visuais, simuladores, desafios práticos, progresso por módulos e uma interface futurista com background animado para tornar o aprendizado mais envolvente.

## Acesse

[Abrir o curso online](https://ricardo-maciel.github.io/MULE-ACADEMY/dashboard.html)

> [!TIP]
> **Credenciais de Teste para Estudos:**
> - **E-mail:** `estudo@email.com`
> - **Senha:** `user123`
>
> *Caso prefira, você também pode utilizar a opção **"Criar conta"** diretamente na tela inicial para registrar um novo usuário para seus estudos. Todo o progresso do curso ficará salvo localmente no seu navegador (`localStorage`).*

## Sobre o Projeto

O MuleAcademy foi criado para transformar conceitos abstratos de integração em experiências práticas. Em vez de apenas explicar o que é uma API, o curso mostra por que sistemas precisam conversar, como dados trafegam, onde surgem falhas e como uma arquitetura centralizada ajuda a organizar esse fluxo.

A trilha foi pensada para quem está começando e precisa construir uma base visual antes de entrar em ferramentas corporativas mais complexas.

## Principais Recursos

- Login, cadastro e controle simples de acesso com `localStorage`
- Dashboard com progresso dos módulos
- Aulas interativas com navegação por capítulos
- Simuladores visuais de sistemas, dados, APIs e integrações
- Laboratórios com validação de respostas e feedback imediato
- Mini game de integração com níveis, logs, erros HTTP e retry
- Playground interativo de arquitetura ponto a ponto e hub central
- Background tecnológico animado com partículas, conexões e resposta ao cursor
- Interface dark, responsiva e com estética de produto educacional moderno

## Trilha de Aprendizado

### Módulo 1: Comunicação entre Sistemas

Introduz o problema de sistemas isolados e mostra por que empresas precisam integrar softwares para automatizar processos e reduzir retrabalho.

### Módulo 2: JSON, XML e CSV

Apresenta os principais formatos de troca de dados, com comparações visuais, exercícios de sintaxe e validação prática.

### Módulo 3: O Caos do Espaguete

Mostra como conexões ponto a ponto crescem em complexidade e tornam a manutenção difícil conforme novos sistemas entram no ecossistema.

### Módulo 4: MuleSoft como Hub Central

Explica a arquitetura centralizada, com sistemas conectados a um hub responsável por organizar fluxos, traduções e isolamento de falhas.

### Módulo 5: Mission Control

Simulador em formato de jogo onde o aluno acompanha pipelines, payloads, status HTTP, logs, falhas e retentativas em um cenário inspirado em e-commerce.

## Tecnologias

- **HTML5** para estrutura das telas
- **CSS3** para layout, glassmorphism, responsividade e animações
- **JavaScript puro** para lógica de aulas, simuladores e interações
- **Canvas API** para o background dinâmico de rede digital
- **SVG** para ilustrações, fluxos e animações educativas
- **Lucide Icons** para iconografia da interface
- **LocalStorage** para progresso, autenticação simulada e estado do aluno

## Estrutura

```text
MULESOFT/
├── login.html              # Acesso, cadastro e área administrativa
├── dashboard.html          # Painel principal do aluno
├── index.html              # Módulo 1
├── modulo2.html            # Módulo 2
├── modulo3.html            # Módulo 3
├── modulo4.html            # Módulo 4
├── modulo5.html            # Módulo 5
├── playground.html         # Playground interativo
├── *.css                   # Estilos específicos das telas
├── *.js                    # Lógica das telas e simuladores
├── tech-background.css     # Estilo do background global
└── tech-background.js      # Motor Canvas do background interativo
```

## Como Executar Localmente

Como o projeto é estático, basta abrir `login.html` no navegador.

Também é possível servir a pasta localmente:

```bash
python -m http.server 4173
```

Depois acesse:

```text
http://127.0.0.1:4173/login.html
```

## Créditos

Projeto idealizado e criado por **Ricardo Maciel**.

Desenvolvido com apoio de ferramentas de inteligência artificial para acelerar prototipação, interface, escrita e refinamento da experiência.
