import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      <App />
    </LocalizationProvider>
  </React.StrictMode>
); 