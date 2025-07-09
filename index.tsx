
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Ensure XMarkIcon is exported from Icons.tsx if NotificationArea uses it directly or indirectly through App.
// It seems App.tsx is already importing the necessary icons for NotificationArea.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Không tìm thấy phần tử root để gắn ứng dụng");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);