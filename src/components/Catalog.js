// [UX FIX] Heuristic #1: Visibility of System Status - Added loading states
// [UX FIX] Heuristic #9: Help Users Recognize, Diagnose, and Recover from Errors - User-friendly error messages
// [UX FIX] Heuristic #11: Accessibility - Fixed empty alt attributes, changed <a> to <button>
// [UX FIX] Heuristic #2: Match Between System and the Real World - Changed CAPS to Title Case
// [UX FIX] Bug Fix: Fixed onclick -> onClick, removed undefined alert_stop() function

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Catalog.css';
import link from '../link.js'

function DynamicImage({ imageUrl, alt, watch }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Получаем базовый URL для Flask API из переменных окружения
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || link.b;
  
  // Формируем полный URL для изображения
  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return '/img/placeholder.png';
    
    // Если путь уже абсолютный URL (начинается с http:// или https://)
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
    
    // Если путь начинается с /static/ - это уже правильный путь для Flask
    if (relativePath.startsWith('/static/')) {
      return `${API_BASE_URL}${relativePath}`;
    }
    
    // Если путь относительный - добавляем /static/images/
    if (!relativePath.startsWith('/')) {
      return `${API_BASE_URL}/static/images/${relativePath}`;
    }
    
    // Для всех остальных случаев
    return `${API_BASE_URL}${relativePath}`;
  };

  useEffect(() => {
    if (imageUrl) {
      const fullUrl = getFullImageUrl(imageUrl);
      setImgSrc(fullUrl);
      setIsLoading(true);
      setHasError(false);
    }
  }, [imageUrl, API_BASE_URL]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    
    // Пытаемся загрузить fallback изображение
    const fallbackUrl = '/img/placeholder.png';
    const img = new Image();
    img.src = fallbackUrl;
    img.onload = () => setImgSrc(fallbackUrl);
    img.onerror = () => setImgSrc(null); // Если даже placeholder не загрузился
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Формируем alt text с fallback значениями
  const altText = alt || (watch ? 
    `Часы ${watch.brand || 'без бренда'} ${watch.name || 'без названия'}, цена ${watch.price || 'не указана'} рублей` : 
    'Изображение часов');

  return (
    <div className={`image-container ${isLoading ? 'loading' : ''} ${hasError ? 'error' : ''}`}>
      <img 
        src={imgSrc || '/img/placeholder.png'} 
        alt={altText}
        className={`img_item ${hasError ? 'error' : ''}`}
        loading="lazy"
        onError={handleError}
        onLoad={handleLoad}
        style={{
          opacity: isLoading ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
          ...(hasError && { 
            filter: 'grayscale(100%) brightness(90%)',
            cursor: 'help'
          })
        }}
      />
      
      {isLoading && (
        <div className="image-loader">
          <div className="spinner"></div>
        </div>
      )}
      
      {hasError && (
        <div className="image-error-overlay" title="Не удалось загрузить изображение">
          <span>⚠️</span>
        </div>
      )}
    </div>
  );
};


function Catalog() {
  const [watches, setWatches] = useState([]);
  
  // [UX FIX] Heuristic #1: Added loading state
  const [loading, setLoading] = useState(true);
  
  // [UX FIX] Heuristic #9: Added error state
  const [error, setError] = useState(null);
  
  // [UX FIX] Heuristic #5: Added filter state for future implementation
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        // [UX FIX] Heuristic #1: Set loading state
        setLoading(true);
        setError(null);

        const response = await axios.get(link.b + '/api/watches'
                   , {
            headers: {
              "ngrok-skip-browser-warning": "69420",  // Любая строка
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          }
        );
        //setWatches(response.data);

        
        // Если data это объект с полем watches
        if (response.data.watches && Array.isArray(response.data.watches)) {
          setWatches(response.data.watches);
        } 
        // Если data это массив
        else if (Array.isArray(response.data)) {
          setWatches(response.data);
        }
        else {
          console.error('Неожиданная структура данных:', response.data);
          setWatches([]); // Защита от падения
        }


      } catch (e) {
        console.error('Ошибка при загрузке часов:', e);
        
        // [UX FIX] Heuristic #9: User-friendly error message
        if (e.request) {
          setError('Не удалось загрузить каталог. Проверьте подключение к интернету.');
        } else {
          setError('Произошла ошибка при загрузке каталога. Попробуйте обновить страницу.');
        }
      } finally {
        // [UX FIX] Heuristic #1: Always set loading to false
        setLoading(false);
      }
    };
    
    fetchWatches();
  }, []);

  // [UX FIX] Heuristic #5: Filter handler (placeholder for future implementation)
  const handleFilterClick = (filterType) => {
    setActiveFilter(filterType);
    // TODO: Implement actual filtering logic
    console.log(`Filter clicked: ${filterType}`);
    alert(`Фильтр "${filterType}" в разработке. Скоро будет доступен!`);
  };

  // [UX FIX] Heuristic #9: Buy button handler with user feedback
  const handleBuyClick = (watch) => {
    // TODO: Implement add to cart functionality
    alert(`Функция "Купить" в разработке. Товар: ${watch.name}`);
  };

  // [UX FIX] Heuristic #1: Loading state UI
  if (loading) {
    return (
      <div className="catalog-loading" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '40px'
      }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #d90000',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: '#666', fontSize: '16px' }}>
          Загрузка каталога часов...
        </p>
      </div>
    );
  }

  // [UX FIX] Heuristic #9: Error state UI
  if (error) {
    return (
      <div className="catalog-error" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
        <h2 style={{ color: '#d90000', marginBottom: '15px' }}>Ошибка загрузки каталога</h2>
        <p style={{ color: '#666', marginBottom: '30px', maxWidth: '500px' }}>
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#d90000',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  // [UX FIX] Heuristic #9: Empty state UI
  if (watches.length === 0) {
    return (
      <div className="catalog-empty" style={{
        textAlign: 'center',
        padding: '60px 20px',
        minHeight: '400px'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>📦</div>
        <h2>Каталог пуст</h2>
        <p style={{ color: '#666', margin: '20px 0' }}>
          В данный момент товары отсутствуют. Пожалуйста, зайдите позже.
        </p>
      </div>
    );
  }

  // [UX FIX] Main render - data loaded successfully
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '30px 0' }}>Каталог часов</h1>

      {/* [UX FIX] Heuristic #11: Changed <a href="#"> to <button> for semantic correctness */}
      {/* [UX FIX] Heuristic #2: Changed CAPS to Title Case */}
      <div className="filters" style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: '20px',
        padding: '20px'
      }}>
        <button 
          className={`filter ${activeFilter === 'price' ? 'active' : ''}`}
          id="price"
          onClick={() => handleFilterClick('Цена')}
          aria-label="Фильтр по цене"
        >
          Цена
        </button>
        <button 
          className={`filter ${activeFilter === 'brand' ? 'active' : ''}`}
          id="brand"
          onClick={() => handleFilterClick('Марка')}
          aria-label="Фильтр по марке"
        >
          Марка
        </button>
        <button 
          className={`filter ${activeFilter === 'gender' ? 'active' : ''}`}
          id="gender"
          onClick={() => handleFilterClick('Пол')}
          aria-label="Фильтр по полу"
        >
          Пол
        </button>
        <button 
          className={`filter ${activeFilter === 'mechanism' ? 'active' : ''}`}
          id="mechanism"
          onClick={() => handleFilterClick('Механизм')}
          aria-label="Фильтр по механизму"
        >
          Механизм
        </button>
        <button 
          className={`filter ${activeFilter === 'other' ? 'active' : ''}`}
          id="other"
          onClick={() => handleFilterClick('Другие фильтры')}
          aria-label="Дополнительные фильтры"
        >
          Ещё фильтры
        </button>
        <button 
          className={`filter filter-badge ${activeFilter === 'new' ? 'active' : ''}`}
          id="new"
          onClick={() => handleFilterClick('Новинка')}
          aria-label="Показать только новинки"
        >
          Новинка
        </button>
        <button 
          className={`filter filter-badge ${activeFilter === 'sale' ? 'active' : ''}`}
          id="sale"
          onClick={() => handleFilterClick('Скидка')}
          aria-label="Показать товары со скидкой"
        >
          Скидка
        </button>
        <button 
          className={`filter ${activeFilter === 'stock' ? 'active' : ''}`}
          id="stock"
          onClick={() => handleFilterClick('В наличии')}
          aria-label="Показать товары в наличии"
        >
          В наличии
        </button>
      </div>

      {/* [UX FIX] Heuristic #1: Show count of items */}
      <div style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
        Найдено товаров: {watches.length}
      </div>

      {/* Catalog items */}
      <div className="catalog-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        padding: '20px'
      }}>
        {Array.isArray(watches) ? (
          watches.map((watch) => (
          <div key={watch.id} className="catalog-item" style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}>
            <a href={`/${watch.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {/* [UX FIX] Heuristic #11: Proper alt text with error handling */}
              <DynamicImage 
                imageUrl={watch.imgUrl} 
                alt={`Часы ${watch.brand} ${watch.name}, цена ${watch.price} рублей`}
                watch={watch}
              />
              <h3 style={{ margin: '15px 0 10px', fontSize: '18px', color: '#333' }}>
                {watch.name}
              </h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                {watch.brand}
              </p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#d90000', marginBottom: '15px' }}>
                {watch.price} ₽
              </p>
            </a>
            
            {/* [UX FIX] Bug Fix: Changed <input type="button"> to <button> */}
            {/* [UX FIX] Bug Fix: Removed onclick="alert_stop()" and added proper handler */}
            <button 
              className="button-pay"
              onClick={() => handleBuyClick(watch)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#d90000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.2s'
              }}
              aria-label={`Купить ${watch.name}`}
            >
              Купить
            </button>
          </div>
        ))) : (
          <div>Данные не загружены или не в правильном формате</div>
        )}
      </div>

      {/* [UX FIX] Heuristic #10: Help text for users */}
      {watches.length > 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#666',
          fontSize: '14px'
        }}>
          <p>Не нашли нужную модель? Свяжитесь с нами для консультации.</p>
        </div>
      )}
    </div>
  );
}

export default Catalog;

