// [UX FIX] Heuristic #1: Visibility of System Status - Added loading states and error handling
// [UX FIX] Heuristic #9: Help Users Recognize, Diagnose, and Recover from Errors - User-friendly error messages
// [UX FIX] Heuristic #3: User Control and Freedom - Added back navigation and breadcrumbs
// [UX FIX] Bug Fix: Fixed crash when accessing watches.name on null object
// [UX FIX] Bug Fix: Fixed classNameName typo -> className
// [UX FIX] Bug Fix: Fixed dependency array in useEffect (added [id])

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderMain from '../components/HeaderMain';
import FooterMain from '../components/FooterMain';
import '../style/WatchPage.css';
import link from '../link.js'


function WatchPage(){
    const { id } = useParams();
    const navigate = useNavigate();
    
    // [UX FIX] Heuristic #1: Added state management for loading, error, and data
    const [watches, setWatches] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchWatches = async () => {
        try {
          // [UX FIX] Heuristic #1: Set loading state before request
          setLoading(true);
          setError(null);
          
          const response = await axios.get(`${link.b}/api/watches/${id}`);
          setWatches(response.data);
        } catch (e) { 
          console.error('Ошибка при загрузке часов:', e);
          
          // [UX FIX] Heuristic #9: User-friendly error messages based on error type
          if (e.response?.status === 404) {
            setError('Товар не найден. Возможно, он был удален или перемещен.');
          } else if (e.request) {
            setError('Не удалось загрузить данные. Проверьте подключение к интернету и попробуйте снова.');
          } else {
            setError('Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу.');
          }
        } finally {
          // [UX FIX] Heuristic #1: Always set loading to false
          setLoading(false);
        }
      }
      
      fetchWatches();
    }, [id]); // [UX FIX] Bug Fix: Added id to dependency array

    // [UX FIX] Heuristic #1: Loading state UI
    if (loading) {
      return (
        <div className="wrapper">
          <HeaderMain/>
          <div className="loading-container" style={{
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
              Загрузка информации о товаре...
            </p>
          </div>
          <FooterMain/>
        </div>
      );
    }

    // [UX FIX] Heuristic #9: Error state UI with recovery options
    if (error) {
      return (
        <div className="wrapper">
          <HeaderMain/>
          <div className="error-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{ color: '#d90000', marginBottom: '15px' }}>Ошибка загрузки</h2>
            <p style={{ color: '#666', marginBottom: '30px', maxWidth: '500px' }}>
              {error}
            </p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
              <button 
                onClick={() => navigate('/')} 
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  color: '#d90000',
                  border: '1px solid #d90000',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Вернуться к каталогу
              </button>
            </div>
          </div>
          <FooterMain/>
        </div>
      );
    }

    // [UX FIX] Heuristic #9: Handle case when data is null but no error
    if (!watches) {
      return (
        <div className="wrapper">
          <HeaderMain/>
          <div className="not-found" style={{
            textAlign: 'center',
            padding: '60px 20px',
            minHeight: '400px'
          }}>
            <h2>Товар не найден</h2>
            <p style={{ color: '#666', margin: '20px 0' }}>
              К сожалению, запрашиваемый товар не существует в нашем каталоге.
            </p>
            <button 
              onClick={() => navigate('/')}
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
              Вернуться к каталогу
            </button>
          </div>
          <FooterMain/>
        </div>
      );
    }

    // [UX FIX] Main render - data is loaded successfully
    return (
    <div className="wrapper"> {/* [UX FIX] Bug Fix: Fixed classNameName -> className */}
      <HeaderMain/>

      {/* [UX FIX] Heuristic #3: User Control and Freedom - Added breadcrumbs */}
      <nav className="breadcrumbs" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '15px 20px',
        fontSize: '14px',
        backgroundColor: '#f8f8f8',
        borderRadius: '4px',
        margin: '20px',
        flexWrap: 'wrap'
      }} aria-label="Навигация">
        <a href="/" style={{ color: '#d90000', textDecoration: 'none' }}>Главная</a>
        <span style={{ margin: '0 8px', color: '#999' }}>/</span>
        <a href="/" style={{ color: '#d90000', textDecoration: 'none' }}>Каталог</a>
        <span style={{ margin: '0 8px', color: '#999' }}>/</span>
        <span style={{ color: '#333', fontWeight: '500' }} aria-current="page">{watches.name}</span>
      </nav>

      {/* [UX FIX] Heuristic #3: User Control and Freedom - Added back button */}
      <div style={{ padding: '0 20px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn-back"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 15px',
            backgroundColor: 'transparent',
            border: '1px solid #ddd',
            borderRadius: '4px',
            color: '#333',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '14px'
          }}
          aria-label="Вернуться назад"
        >
          ← Назад к каталогу
        </button>
      </div>

      <main className="product-page">
        <div className="product-page__container">
          <div className="product-page__gallery gallery">
            <div className="gallery__main">
              {/* [UX FIX] Heuristic #11: Accessibility - Added meaningful alt text and error handling */}
              <img 
                id="mainProductImage" 
                src={watches.imgUrl || '/img/placeholder.png'} 
                alt={`Фотография часов ${watches.brand} ${watches.name}`}
                className="gallery__image"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/placeholder.png';
                }}
              />
            </div>
            
            <div className="gallery__thumbnails">
              <button 
                className="thumbnail-btn active" 
                data-image={watches.imgUrl}
                aria-label="Основное изображение товара"
              >
                <img 
                  src={watches.imgUrl || '/img/placeholder.png'} 
                  alt={`Миниатюра 1 - ${watches.name}`}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/img/placeholder.png';
                  }}
                />
              </button>
            </div>
          </div>

          <div className="product-page__info product-info">
            <h1 className="product-info__title">{watches.name}</h1>
            
            <div className="product-info__brand">
              <span className="label">Бренд:</span>
              <span className="value">{watches.brand}</span>
            </div>

            <div className="product-info__price">
              <span className="price__current">{watches.price} ₽</span>
            </div>

            <div className="product-info__actions">
              <button 
                className="btn btn--primary btn--add-to-cart"
                onClick={() => {
                  // [UX FIX] Heuristic #9: User feedback for action
                  alert('Функция "Добавить в корзину" в разработке');
                }}
              >
                Добавить в корзину
              </button>
              
              {/* [UX FIX] Heuristic #11: Accessibility - aria-label already present, kept it */}
              <button 
                className="btn btn--icon btn--favorite" 
                aria-label="Добавить в избранное"
                title="Добавить в избранное"
                onClick={() => {
                  alert('Функция "Избранное" в разработке');
                }}
              >
                <i className="far fa-heart"></i>
              </button>
            </div>

            <div className="product-info__tabs tabs">
              <div className="tabs__header">
                <button className="tabs__btn active" data-tab="description">
                  Описание
                </button>
                <button className="tabs__btn" data-tab="specs">
                  Характеристики
                </button>
                <button className="tabs__btn" data-tab="reviews">
                  Отзывы
                </button>
              </div>

              <div className="tabs__content">
                <div className="tabs__panel active" id="description">
                  <p>{watches.description || 'Описание товара отсутствует.'}</p>
                </div>

                <div className="tabs__panel" id="specs">
                  <ul className="specs-list">
                    <li><strong>Бренд:</strong> {watches.brand}</li>
                    <li><strong>Модель:</strong> {watches.name}</li>
                    <li><strong>Цена:</strong> {watches.price} ₽</li>
                  </ul>
                </div>

                <div className="tabs__panel" id="reviews">
                  <p>Отзывы пока отсутствуют. Будьте первым!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterMain/>
    </div>
  )
}

export default WatchPage;


