# Semideuses RPG — Criador de Fichas

Ficha digital para Semideuses RPG (3ª Edição): filiação com os 26 deuses, atributos,
perícias, combate, poderes divinos, talentos, equipamento e personalidade — com cálculo
automático de PV, Mana, CA e bônus de proficiência. Os personagens ficam salvos no
`localStorage` do próprio navegador.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy no Vercel

1. Suba esta pasta inteira para um repositório no GitHub (ela precisa ter `package.json`,
   `index.html`, `vite.config.js` e a pasta `src/` na raiz do repositório).
2. No Vercel, clique em **Add New → Project** e importe o repositório.
3. O Vercel detecta automaticamente o framework **Vite** — não precisa mudar nada nas
   configurações de build (Build Command: `vite build`, Output Directory: `dist`).
4. Clique em **Deploy**.

> O erro `404: NOT_FOUND` acontece quando o Vercel recebe só o arquivo `App.jsx` solto,
> sem um projeto completo em volta. Com esta pasta ele já reconhece e builda certinho.
