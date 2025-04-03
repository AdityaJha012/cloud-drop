import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './routes/AppRouter';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen py-4">
        <ToastContainer />
        <AppRouter />
      </div>
    </ThemeProvider>
  );
}

export default App;
