#Photographer Portfolio (MEVN Stack)
這是一個以 MEVN（MongoDB、Express.js、Vue.js、Node.js）為技術基礎所打造的攝影作品集網站，提供攝影師登入、並能夠不透過後台進行上傳及編輯/管理圖片、以及聯絡功能，適合展示個人攝影作品或作為前端/全端技能展示的作品。

#技術
Frontend: Vue 3 + Vite + Vue Router + Pinia

Styling: TailwindCSS + Vuetify

Backend: Node.js + Express.js

Database: MongoDB (Mongoose ODM)

Auth: Passport.js

Image Cloudbase: Cloudinary

Email: Email.js

#功能特色
使用者功能
✅ 登入 / 登出

攝影作品管理
✅ 上傳/編輯/刪除任何可見圖片（支援標題、描述、分類等）

✅ 根據分類篩選不同圖片

✅ 圖片壓縮與優化（使用 Cloudinary）

溝通聯絡功能
✅ 聯絡表單：可發送郵件至攝影師信箱

#專案畫面截圖（可選）
首頁:

作品集頁面:

聯絡頁面:


#專案結構:

photographer-portfolio/
├── server/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── utils/
│ ├── server.js
│ ├── package.json
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
│ ├── package.json
│ └── README.md



#作者資訊
🌐 個人網站 / GitHub（可選）


#開發動機
最初一開始是想要幫攝影師朋友做一個攝影作品集網站，因為朋友最初是使用Adobe Portfolio製作，雖是很方便的平台，
但是排版的限制以及圖片質量的壓縮，讓整體的效果差強人意，因此原本只是想做純前端，
就變成了"為何不做一個方便他可以直接管理整個網站的全端平台呢?"，
順便依靠強大的cloudinary來控制圖片質量，以及emailjs來處理聯絡表單。

#開發心得
1.管理目標的能力:
從原本只是想做前端，到後面改成全端開發，一下子很多的想法就都併發出來，
"輪播是不是該能調整順序?" "章節圖片該如何呈現/如何解決況裝置錯誤問題?"
"圖片類型的不同牽扯到的資料庫規劃"等等，因為一開始沒有規劃完全，或者說想得不夠徹底，
導致有很多東西做到一半，就先被新的想法吸引，東做一點西做一點，浪費了不少的時間。
下次應該要先嚴格執行MVP，先完成最基本的功能，再慢慢添加其他功能。

2.是否重複造輪子:
在這次處理圖片的拖曳功能時，花了很長的時間考慮呈現方式，以及是否要自己理解，重作一個拖曳功能?
從是否
