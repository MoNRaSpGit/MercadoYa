import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './Store/store';
import 'bootstrap/dist/css/bootstrap.min.css';


// Agrega un log para confirmar que `index.js` se carga


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
