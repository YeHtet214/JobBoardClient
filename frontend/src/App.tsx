import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import AppRoutes from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
