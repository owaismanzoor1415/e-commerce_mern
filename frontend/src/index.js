import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ShopContextProvider from './Context/ShopContext';
import { NotificationProvider } from './Context/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NotificationProvider>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </NotificationProvider>
);
