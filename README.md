# MuleAcademy

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-34d399?style=for-the-badge)
![Frontend](https://img.shields.io/badge/frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-38bdf8?style=for-the-badge)
![Projeto](https://img.shields.io/badge/projeto-curso%20interativo-8b5cf6?style=for-the-badge)
![Módulos](https://img.shields.io/badge/módulos-3%20ativos-f59e0b?style=for-the-badge)

Plataforma didática e gamificada para ensinar integração de sistemas, APIs, formatos de dados, DataWeave e conceitos de MuleSoft para iniciantes — com aulas visuais, simuladores práticos e interface futurista animada.

## Acesse

[Abrir o curso online](https://ricardo-maciel.github.io/MULE-ACADEMY/dashboard.html)

> [!TIP]
> **Credenciais de Teste:**
> - **E-mail:** `estudo@email.com`
> - **Senha:** `user123`
>
> *Ou crie sua própria conta na tela inicial. O progresso fica salvo no `localStorage` do navegador.*

---

## 🎨 Identidades Visuais

Escolha sua identidade na tela de login — só muda a aparência, o conteúdo e o progresso são os mesmos.

| | Identidade | Visual |
|---|---|---|
| ![MuleCraft](MuleCraftIcone.png) | **MuleCraft** *(padrão)* | Tema roxo e ciano, estilo tech corporativo. |
| ![MuleSemFreio](MuleSemFreio.png) | **Mule Sem Freio** | Tema laranja vibrante com mascote, estilo descontraído. |

---

## ⚡ Modo Desempenho

Controla os efeitos visuais do background. Ajuste conforme o hardware do dispositivo.

| Modo | Ícone | O que faz |
|---|---|---|
| **Normal** | ⚡ | Todos os efeitos ativos. |
| **Médio** *(padrão)* | ✨ | Efeitos reduzidos — bom equilíbrio. |
| **Máximo** | 🖥️ | Animações desativadas — foco no conteúdo. |

> 💡 A preferência fica salva automaticamente entre sessões.

---

## 📚 Trilha de Aprendizado

### Módulo 1 — Introdução a Integrações
Plataforma introdutória para entender a importância e os conceitos fundamentais de conexões entre sistemas.

1. **Aula 1: Comunicação entre Sistemas** — Por que as empresas precisam integrar seus softwares e o que acontece quando eles operam isolados.
2. **Aula 2: JSON, XML e CSV** — Aprenda a decifrar a "linguagem" que os computadores usam para enviar dados entre si.
3. **Aula 3: O Problema da Complexidade** — Entenda por que criar conexões manuais "ponto a ponto" vira um pesadelo de manutenção.
4. **Aula 4: MuleSoft como Solução** — Como a plataforma MuleSoft age como um hub centralizado organizando o fluxo de dados.
5. **Aula 5: Projeto Prático** — Simulação real de uma compra online integrada com pagamento, estoque e logística de entrega.

### Módulo 2 — Dados: A Linguagem dos Sistemas
Aprofundamento sobre a transmissão de informações e formatação de dados no ambiente corporativo.

1. **Aula 1: Introdução & Idiomas** — Descubra como diferentes sistemas "falam" idiomas próprios e por que precisam de tradutores para se comunicar.
2. **Aula 2: Formatos Corporativos** — Aprenda os três idiomas tech: JSON, XML e CSV — suas estruturas, analogias e quando usar cada um.
3. **Aula 3: Simulador de Tradução** — Resolva desafios práticos: identifique idiomas, escolha integrações e complete a missão de fixação interativa.

### Módulo 3 — DataWeave: O Poder do Tradutor
Aprenda a transformar dados na prática com DataWeave, a linguagem de transformação nativa do MuleSoft, de forma simples, visual e aplicada.

> [!NOTE]
> A Aula 1 deste módulo está sempre desbloqueada — qualquer aluno pode explorar os conceitos introdutórios sem precisar concluir o Módulo 2 primeiro.

1. **Aula 1: O Tradutor por Dentro** — Entenda o que é DataWeave com animações interativas de fluxo JSON → XML. Inclui a explicação lúdica do conceito de **Payload** com um visualizador animado de caminhão de entregas.
2. **Aula 2: Sua Primeira Tradução (Hello World)** — Escreva seus primeiros scripts DataWeave interativos: leia campos do `payload` e mapeie chaves de JSON para JSON com validação em tempo real.
3. **Aula 3: Mudando Idiomas** — Pratique a conversão entre formatos: JSON → XML e CSV → JSON, usando o seletor de `output` no editor simulado.
4. **Aula 4: Regras do Tradutor** — Domine as três ferramentas essenciais do DataWeave: `map` (transformar listas), `filter` (filtrar elementos) e `if/else` (lógica condicional).
5. **Aula 5: Missão Final — Simulador** — Monte um script DataWeave completo em um cenário de e-commerce real: filtre maiores de idade e mapeie campos `nome→name` e `idade→age` para saída em XML.

> [!TIP]
> Ao concluir cada aula, um botão **"Praticar no DataWeave Playground"** é revelado ao lado da próxima ação, permitindo ao aluno experimentar os conceitos aprendidos no ambiente oficial da MuleSoft.

---

## 🛠️ Recursos Principais

- **Login & Admin** — Controle de acesso, painel administrativo com métricas e logs de auditoria
- **Dashboard de Progresso** — Módulos liberados sequencialmente conforme conclusão (com Aula 1 de cada módulo sempre acessível)
- **Simuladores** — APIs, JSON, XML, HTTP e playground de arquitetura drag-and-drop
- **Editor Interativo de DataWeave** — Scripts com lacunas, validação em tempo real e feedback instruído por dicas
- **Missão Final DataWeave** — Simulador de e-commerce com montagem completa de script e saída XML renderizada
- **Scanner de Tecnologias** — Simulação visual de varredura de sistemas da empresa
- **Efeitos Sonoros** — Sintetizados via Web Audio API, sem arquivos externos
- **Background Interativo** — Motor Canvas com constelação que responde ao cursor
- **Botões de Prática** — Links contextuais para o [DataWeave Playground oficial](https://dataweave.mulesoft.com/learn/) revelados após cada aula concluída

---

## 🔧 Tecnologias

- HTML5 · CSS3 · JavaScript (ES6+)
- Canvas API · Web Audio API · SVG
- Lucide Icons · LocalStorage · SessionStorage

---

## Estrutura

```text
MULESOFT/
├── login.html        # Acesso, cadastro e Portal Administrativo
├── dashboard.html    # Painel do aluno com progresso dos 3 módulos
├── index.html        # Módulo 1 — Integrações (Aula 1)
├── modulo2.html      # Módulo 1 — Aula 2
├── modulo3.html      # Módulo 1 — Aula 3
├── modulo4.html      # Módulo 1 — Aula 4
├── modulo5.html      # Módulo 1 — Aula 5
├── dados.html        # Módulo 2 — Dados: A Linguagem dos Sistemas (3 aulas)
├── dataweave.html    # Módulo 3 — DataWeave: O Poder do Tradutor (5 aulas + simulador)
├── playground.html   # Playground interativo de APIs e arquitetura
├── *.css / *.js      # Estilos e lógica por tela
└── tech-background.* # Motor Canvas do background animado
```

---

## Como Executar Localmente

Basta abrir `login.html` no navegador. Ou sirva localmente:

```bash
# Node.js
npx http-server -p 8000

# Python
python -m http.server 8000
```

Acesse: `http://127.0.0.1:8000/login.html`

---

## Créditos

Projeto idealizado e criado por **Ricardo Maciel**, com apoio de ferramentas de inteligência artificial para prototipação e refinamento da experiência.

## Créditos

Idealizado e criado por **Ricardo Maciel**, com apoio de ferramentas de inteligência artificial.

Este projeto tem como propósito educacional apoiar o aprendizado de novos desenvolvedores e entusiastas da área de integração, oferecendo exemplos práticos e acessíveis para facilitar a compreensão de conceitos e acelerar a evolução no ecossistema de APIs e integrações.
