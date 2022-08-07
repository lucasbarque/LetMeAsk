import { AuthContextProvider } from './context/AuthContext';

import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router';

export function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Router />
      </AuthContextProvider>
    </BrowserRouter>
  );
}
