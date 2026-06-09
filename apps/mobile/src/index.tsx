import ReactDOM from 'react-dom/client';
import App from 'telegramonic-client-common';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<App />);

reportWebVitals();
