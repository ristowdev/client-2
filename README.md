## How to install
```bash
$ npm install
```

## How to run
```bash
$ npm run dev
```

## How to deploy
```bash
API_URL=add the API URL in .env file
npm start
```

## How to use the style

- Use tailwind/bootstrap classes

- All template styles are added in `_document.js`

- To import a style in node_module please add it in `_app.js`

```js
// app.js
// other import

// module styles
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'react-toastify/dist/ReactToastify.css';
import '@progress/kendo-theme-default/dist/all.css';
