import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import AppRoutes from './routes';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
