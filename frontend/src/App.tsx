import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 transition-colors">
        <AppRouter />
      </div>
    </ThemeProvider>
  );
}

export default App;
