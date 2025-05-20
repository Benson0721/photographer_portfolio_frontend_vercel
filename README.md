# Photographer Portfolio (MEVN Stack)

這是一個以 MEVN（MongoDB、Express.js、Vue.js、Node.js）為技術基礎所打造的攝影作品集網站，提供攝影師登入、並能夠不透過後台進行上傳及編輯/管理圖片、以及聯絡功能，適合展示個人攝影作品的網頁。

## 目錄

- [技術](#技術)
- [專案畫面截圖](#專案畫面截圖)
- [專案結構](#專案結構)
- [作者資訊](#作者資訊)

## 技術

Frontend: Vue 3 + Vite + Vue Router + Pinia

Styling: TailwindCSS + Vuetify

Backend: Node.js + Express.js

Database: MongoDB (Mongoose ODM)

Auth: Passport.js

Image Cloudbase: Cloudinary

Email: Email.js

## 功能特色

使用者功能
- 登入 / 登出

攝影作品管理:  
- 上傳/編輯/刪除任何可見圖片（支援標題、描述、分類等）  
- 根據分類篩選不同圖片  
- 圖片壓縮與優化（使用 Cloudinary）

溝通聯絡功能
- 聯絡表單：可發送郵件至攝影師信箱

## 專案結構

```
photographer-portfolio/
├── server/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── utils/
│ ├── server.js
│ └── package.json
│
├── client/
│ ├── src/
│ │ ├── apis/
│ │ ├── types/
│ │ ├── utils/
│ │ ├── components/
│ │ ├── assets/
│ │ ├── views/
│ │ ├── stores/
│ │ └── router/
│ ├── vite.config.js
│ └── package.json
│
└── README.md
```

## 專案畫面截圖

### 首頁  
(可編輯:輪播/主題)
![首頁展示](./screenshots/home.gif)

### 作品集頁面  
(可編輯:各章節/合輯圖片)
![作品集展示](./screenshots/portfolio.gif)

### 聯絡頁面  
(可編輯:圖片)
![聯絡展示](./screenshots/about.gif)

## 作者資訊
- 作品集 - [Mpass](https://www.notion.so/Front-End-layout-Portfolio-1c4acba779c38053a9dcf4b1caa7af0c)
