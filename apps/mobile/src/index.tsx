/* eslint-disable import/first */
// Polyfill structuredClone for older WebView runtimes (Chromium < 99)
if (typeof window !== 'undefined' && !(window as any).structuredClone) {
  (window as any).structuredClone = function structuredClone(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      return new RegExp(obj.source, obj.flags);
    }
    if (obj instanceof Map) {
      const copy = new Map();
      obj.forEach((value, key) => {
        copy.set(structuredClone(key), structuredClone(value));
      });
      return copy;
    }
    if (obj instanceof Set) {
      const copy = new Set();
      obj.forEach((value) => {
        copy.add(structuredClone(value));
      });
      return copy;
    }
    if (Array.isArray(obj)) {
      const copy: any[] = [];
      for (let i = 0; i < obj.length; i++) {
        copy[i] = structuredClone(obj[i]);
      }
      return copy;
    }
    if (obj instanceof Object) {
      const copy: { [key: string]: any } = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          copy[key] = structuredClone(obj[key]);
        }
      }
      return copy;
    }
  };
}

// Polyfill Array.prototype.at and String.prototype.at for older WebView runtimes (Chromium < 92)
if (!Array.prototype.at) {
  Array.prototype.at = function (n: number) {
    n = Math.trunc(n) || 0;
    if (n < 0) n += this.length;
    if (n < 0 || n >= this.length) return undefined;
    return this[n];
  };
}

if (!String.prototype.at) {
  String.prototype.at = function (n: number) {
    n = Math.trunc(n) || 0;
    if (n < 0) n += this.length;
    if (n < 0 || n >= this.length) return '';
    return this.charAt(n);
  };
}

import ReactDOM from 'react-dom/client';
import App from 'telegramonic-client-common';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<App />);

reportWebVitals();
