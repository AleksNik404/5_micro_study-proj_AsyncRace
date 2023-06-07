import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.scss';
import App from '@/App';
import { store } from '@/store/store';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>
);
