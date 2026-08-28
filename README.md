# MG Sri Lanka Landing Page

Vue 3 + Vite starter project for the new MG Sri Lanka landing page.

## 1. Requirements

Install a current Node.js version supported by the latest Vue/Vite tooling.

Check:

```bash
node -v
npm -v
```

## 2. Install

Open the project folder in VS Code and run:

```bash
npm install
```

## 3. Run locally

```bash
npm run dev
```

Open the local URL shown in the terminal.

## 4. Build

```bash
npm run build
```

The production files will be created in `dist/`.

## 5. Replace hero images

Place your real hero images inside:

```text
public/images/
```

Then update the `slides` array in:

```text
src/components/MgHero.vue
```

Example:

```js
image: '/images/mg-s5.jpg'
```

## 6. Add hero videos

Place MP4 files inside:

```text
public/videos/
```

Then change:

```js
video: ''
```

to:

```js
video: '/videos/mg-s5.mp4'
```

The hero currently uses placeholder artwork so the project runs immediately.

## Main folders

```text
mg-sri-lanka-landing/
├── public/
│   ├── images/
│   └── videos/
├── src/
│   ├── assets/
│   │   └── main.css
│   ├── components/
│   │   └── MgHero.vue
│   ├── router/
│   │   └── index.js
│   ├── views/
│   │   └── HomeView.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```
