import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/LoginPage.css';
import '../style/AdminPage.css';

function AdminPage() {
  // Состояния для аутентификации
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  // Состояния для работы с часами
  const [watches, setWatches] = useState([]);
  const [currentWatch, setCurrentWatch] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    imgUrl: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Состояние для бокового меню
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [activeSection, setActiveSection] = useState('catalog');
  
  // Переключение видимости меню
  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

  // Проверка авторизации при загрузке страницы
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }
      
      setToken(storedToken);
      
      try {
        const response = await axios.post('http://localhost:5000/api/checktoken', {
          token: storedToken
        });
        
        if (response.data.authorization) {
          setIsAuth(true);
          // Загружаем данные о часах после успешной аутентификации
          fetchWatches();
        } else {
          navigate('/');
        }
      } catch (e) {
        console.error('Ошибка проверки токена:', e);
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Функция для загрузки часов с сервера
  const fetchWatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/watches');
      setWatches(response.data);
    } catch (e) {
      console.error('Ошибка при загрузке часов:', e);
    }
  };

  // Обработка выхода из аккаунта
  const handleExit = () => {
    localStorage.setItem('token', '');
    navigate('/');
  };

  // Обработка изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentWatch(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Добавление новых часов
  const handleAddWatch = async (e) => {
    e.preventDefault();
    
    try {
      // Создаем конфигурацию с заголовком авторизации
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      if (editMode) {
        // Обновление существующих часов
        await axios.put(`http://localhost:5000/api/watches/${editId}`, currentWatch, config);
        setEditMode(false);
        setEditId(null);
      } else {
        // Добавление новых часов
        await axios.post('http://localhost:5000/api/watches', currentWatch, config);
      }
      
      // Сбрасываем форму и обновляем список часов
      setCurrentWatch({
        name: '',
        brand: '',
        price: '',
        description: '',
        imgUrl: ''
      });
      
      // Обновляем список часов
      fetchWatches();
    } catch (e) {
      console.error('Ошибка при сохранении часов:', e);
    }
  };

  // Удаление часов
  const handleDeleteWatch = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту модель часов?')) {
      try {
        await axios.delete(`http://localhost:5000/api/watches/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Обновляем список после удаления
        fetchWatches();
      } catch (e) {
        console.error('Ошибка при удалении часов:', e);
      }
    }
  };

  // Функция для начала редактирования часов
  const handleEditWatch = (watch) => {
    setCurrentWatch({
      name: watch.name,
      brand: watch.brand,
      price: watch.price,
      description: watch.description,
      imgUrl: watch.imgUrl || ''
    });
    setEditMode(true);
    console.log(editMode)
    setEditId(watch.id);
  };

  // Отмена редактирования
  const handleCancelEdit = () => {
    setCurrentWatch({
      name: '',
      brand: '',
      price: '',
      description: '',
      imgUrl: ''
    });
    setEditMode(false);
    setEditId(null);
  };

  // Если авторизация не пройдена, показываем загрузку
  if (!isAuth) {
    return <div className="loading">Проверка авторизации...</div>;
  }

  // Рендеринг каталога часов
  const renderCatalog = () => {
    return (
      <div className="watches-list-container">
        <h2>Каталог часов</h2>
        
        {watches.length === 0 ? (
          <p>В каталоге пока нет часов</p>
        ) : (
          <div className="watches-list">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Изображение</th>
                  <th>Название</th>
                  <th>Бренд</th>
                  <th>Цена</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {watches.map(watch => (
                  <tr key={watch.id}>
                    <td>{watch.id}</td>
                    <td>
                      {watch.imgUrl ? (
                        <img src={watch.imgUrl} alt={watch.name} className="watch-thumbnail" />
                      ) : (
                        <span>Нет изображения</span>
                      )}
                    </td>
                    <td>{watch.name}</td>
                    <td>{watch.brand}</td>
                    <td>{watch.price}</td>
                    <td className="actions-cell">
                      <button 
                        onClick={() => handleEditWatch(watch)} 
                        className="edit-btn"
                      >
                        Редактировать
                      </button>
                      <button 
                        onClick={() => handleDeleteWatch(watch.id)} 
                        className="delete-btn"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  const renderEditForm = () => {
    return (      
    <div className="watch-form-container">
        <h2>Редактировать часы</h2>
        <form onSubmit={handleAddWatch} className="watch-form">
          <div className="form-group">
            <label>Название:</label>
            <input
              type="text"
              name="name"
              value={currentWatch.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Бренд:</label>
            <input
              type="text"
              name="brand"
              value={currentWatch.brand}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Цена:</label>
            <input
              type="text"
              name="price"
              value={currentWatch.price}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Описание:</label>
            <textarea
              name="description"
              value={currentWatch.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>URL изображения:</label>
            <input
              type="text"
              name="imgUrl"
              value={currentWatch.imgUrl}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="save-btn">
              Изменить часы
            </button>
          </div>
        </form>
        <br/>
        <br/>
        {renderCatalog()}
      </div>)
  }
  // Рендеринг формы добавления часов
  const renderAddForm = () => {
    // Сбрасываем режим редактирования при переходе на форму добавления
    if (editMode) {
      handleCancelEdit();
    }
    
    return (
      <div className="watch-form-container">
        <h2>Добавить новые часы</h2>
        <form onSubmit={handleAddWatch} className="watch-form">
          <div className="form-group">
            <label>Название:</label>
            <input
              type="text"
              name="name"
              value={currentWatch.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Бренд:</label>
            <input
              type="text"
              name="brand"
              value={currentWatch.brand}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Цена:</label>
            <input
              type="text"
              name="price"
              value={currentWatch.price}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Описание:</label>
            <textarea
              name="description"
              value={currentWatch.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>URL изображения:</label>
            <input
              type="text"
              name="imgUrl"
              value={currentWatch.imgUrl}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="save-btn">
              Добавить часы
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Рендеринг секции удаления часов
  const renderDeleteSection = () => {
    return (
      <div className="delete-section-container">
        <h2>Удалить экземпляр часов</h2>
        
        {watches.length === 0 ? (
          <p>В каталоге пока нет часов для удаления</p>
        ) : (
          <div className="delete-watches-list">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Изображение</th>
                  <th>Название</th>
                  <th>Бренд</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {watches.map(watch => (
                  <tr key={watch.id}>
                    <td>{watch.id}</td>
                    <td>
                      {watch.imgUrl ? (
                        <img src={watch.imgUrl} alt={watch.name} className="watch-thumbnail" />
                      ) : (
                        <span>Нет изображения</span>
                      )}
                    </td>
                    <td>{watch.name}</td>
                    <td>{watch.brand}</td>
                    <td>
                      <button 
                        onClick={() => handleDeleteWatch(watch.id)} 
                        className="delete-btn"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Выбор секции для отображения
  const renderActiveSection = () => {
    switch(activeSection) {
      case 'catalog':
        return renderCatalog();
      case 'add':
        return renderAddForm();
      case 'edit':
        return renderEditForm();
      case 'delete':
        return renderDeleteSection();
      default:
        return renderCatalog();
    }
  }

  return (
    <div className="admin-container">
      {/* Боковое меню */}
      <div className={`sidebar ${sidebarHidden ? 'hidden' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">Админ-панель</div>
          <button className="menu-toggle-btn" onClick={toggleSidebar}>×</button>
        </div>
        
        <ul className="sidebar-menu">
          <li>
            <a 
              className={activeSection === 'catalog' ? 'active' : ''}
              onClick={() => setActiveSection('catalog')}
            >
              Каталог часов
            </a>
          </li>
          <li>
            <a 
              className={activeSection === 'add' ? 'active' : ''}
              onClick={() => setActiveSection('add')}
            >
              Добавить экземпляр
            </a>
          </li>
          <li>
            <a 
              className={activeSection === 'edit' ? 'active' : ''}
              onClick={() => setActiveSection('edit')}
            >
              Редактировать экземпляр
            </a>
          </li>
          <li>
            <a 
              className={activeSection === 'delete' ? 'active' : ''}
              onClick={() => setActiveSection('delete')}
            >
              Удалить экземпляр
            </a>
          </li>
        </ul>
        
        <div className="sidebar-footer">
          <button onClick={handleExit}>Выйти из аккаунта</button>
        </div>
      </div>
      
      {/* Основная область контента */}
      <div className={`main-content ${sidebarHidden ? 'expanded' : ''}`}>
        <div className="content-header">
          <button className="toggle-menu-btn" onClick={toggleSidebar}>☰</button>
          <div className="admin-title">
            {activeSection === 'catalog' && 'Управление каталогом часов'}
            {activeSection === 'add' && 'Добавление новой модели часов'}
            {activeSection === 'delete' && 'Удаление моделей часов'}
          </div>
        </div>
        
        {/* Отображение активной секции */}
        {renderActiveSection()}
      </div>
    </div>
  );
}

export default AdminPage;