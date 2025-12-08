import './style/App.css';
import Main from './pages/Main.js';
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.js'
import AdminPage from './pages/AdminPage.jsx';
import YandexCallback from './components/YandexCallback.js';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/auth/yandex/callback" element={<YandexCallback/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Main />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
    
  );
}

export default App;
