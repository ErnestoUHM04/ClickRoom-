import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Resultados from './Resultados';
import Hotel from './Hotel';
import TerYCon from './TerYCon';
import AvPriv from './AvPriv';
import AvLeg from './AvLeg';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/hotel/:id" element={<Hotel />} />
        <Route path="/terycon" element={<TerYCon />} />
        <Route path="/avPriv" element={<AvPriv />} />
        <Route path="/avLeg" element={<AvLeg />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

