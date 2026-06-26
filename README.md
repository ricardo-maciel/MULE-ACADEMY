# MuleAcademy

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-34d399?style=for-the-badge)
![Frontend](https://img.shields.io/badge/frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-38bdf8?style=for-the-badge)
![Projeto](https://img.shields.io/badge/projeto-curso%20interativo-8b5cf6?style=for-the-badge)

Plataforma didática e gamificada para ensinar integração de sistemas, APIs, formatos de dados e conceitos de MuleSoft para iniciantes — com aulas visuais, simuladores práticos e interface futurista animada.

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

1. **Comunicação entre Sistemas** — Por que empresas precisam integrar softwares
2. **JSON, XML e CSV** — Formatos de troca de dados com exercícios práticos
3. **O Caos do Espaguete** — Como conexões ponto a ponto viram um pesadelo
4. **MuleSoft como Hub Central** — Arquitetura centralizada e seus benefícios
5. **Mission Control** — Simulador de pipelines, falhas e retentativas

---

## 🛠️ Recursos Principais

- **Login & Admin** — Controle de acesso, painel administrativo com métricas e logs de auditoria
- **Dashboard de Progresso** — Módulos liberados sequencialmente conforme conclusão
- **Simuladores** — APIs, JSON, XML, HTTP e playground de arquitetura drag-and-drop
- **Scanner de Tecnologias** — Simulação visual de varredura de sistemas da empresa
- **Efeitos Sonoros** — Sintetizados via Web Audio API, sem arquivos externos
- **Background Interativo** — Motor Canvas com constelação que responde ao cursor

---

## 🔧 Tecnologias

- HTML5 · CSS3 · JavaScript (ES6+)
- Canvas API · Web Audio API · SVG
- Lucide Icons · LocalStorage · SessionStorage

---

## Estrutura

```text
MULESOFT/
├── login.html       # Acesso, cadastro e Portal Administrativo
├── dashboard.html   # Painel do aluno
├── index.html       # Módulo 1
├── modulo2.html     # Módulo 2
├── modulo3.html     # Módulo 3
├── modulo4.html     # Módulo 4
├── modulo5.html     # Módulo 5
├── playground.html  # Playground interativo
├── *.css / *.js     # Estilos e lógica por tela
└── tech-background.* # Motor Canvas do background
```

---

## Como Executar Localmente

Basta abrir `login.html` no navegador. Ou sirva localmente:

```bash
python -m http.server 4173
```

Acesse: `http://127.0.0.1:4173/login.html`

---

## Créditos

Projeto idealizado e criado por **Ricardo Maciel**, com apoio de ferramentas de inteligência artificial para prototipação e refinamento da experiência.
