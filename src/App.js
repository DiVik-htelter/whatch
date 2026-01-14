import './style/App.css';
import Main from './pages/Main.js';
import LoginPage from './pages/LoginPage.js'
import NotFoundPage from './pages/NotFoundPage_ux_improved.js'
import AdminPage from './pages/AdminPage.js';
import YandexCallback from './components/YandexCallback.js';
import WatchPage from './pages/WatchPage.js'

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
        <Route path="/:id" element={<WatchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Main />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
    
  );
}

export default App;
