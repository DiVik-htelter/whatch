import './style/App.css';
import Main from './pages/Main.js';
import NotFoundPage from './pages/NotFoundPage.js'

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
    
  );
}

export default App;
