import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import HeaderMain from '../components/HeaderMain';
import FooterMain from '../components/FooterMain'
import '../style/WatchPage.css';
import { useParams } from 'react-router-dom';


function WatchPage(){
    const { id } = useParams();
    const [watches, setWatches] = useState(null);

    useEffect(() => {
      const fetchWatches = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/watches/${id}`);
        setWatches(response.data);
        console.log(watches);
      } catch (e) { 
        console.error('Ошибка при загрузке часов:', e);
      }
    }
      fetchWatches();
      //console.log(watches);
    }, []);



    return (
    <div classNameName="wrapper">

      <HeaderMain/>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>


  <main className="product-page">
    <div className="product-page__container">
      <section className="product-gallery">
        <div className="gallery__main">
          <img src="https://via.placeholder.com/445x560?text=Часы+Слава+Инстинкт" 
               alt="Часы Слава Инстинкт 6239485/2025" 
               className="gallery__main-img" 
               id="mainProductImage"/>
        </div>
        
        <div className="gallery__thumbnails">
          <button className="thumbnail-btn active" data-image="https://via.placeholder.com/445x560?text=Часы+Слава+Инстинкт">
            <img src="https://via.placeholder.com/76x76?text=1" alt="Вид часов 1"/>
          </button>
          <button className="thumbnail-btn" data-image="https://via.placeholder.com/445x560?text=Часы+Боковой+вид">
            <img src="https://via.placeholder.com/76x76?text=2" alt="Вид часов 2"/>
          </button>
          <button className="thumbnail-btn" data-image="https://via.placeholder.com/445x560?text=Часы+Сзади">
            <img src="https://via.placeholder.com/76x76?text=3" alt="Вид часов 3"/>
          </button>
          <button className="thumbnail-btn" data-image="https://via.placeholder.com/445x560?text=Часы+Деталь">
            <img src="https://via.placeholder.com/76x76?text=4" alt="Вид часов 4"/>
          </button>
        </div>
      </section>

      <section className="product-info">
        <div className="dealer-info">
          <div className="dealer-info__content">
            <span className="dealer-info__badge">Официальный дилер</span>
            <img src="https://via.placeholder.com/60x30?text=СЛАВА" alt="Логотип Слава" className="dealer-info__logo"/>
          </div>
        </div>
        
        <h1 className="product-info__title">{watches.name}</h1>
        <p className="product-info__category">Женские</p>
        
        <div className="product-info__price">
          <span className="price__value">{watches.price}</span>
          <span className="price__old">18 500 ₽</span>
          <span className="price__discount">-24%</span>
        </div>
        
        <div className="product-info__actions">
          <button className="btn btn--primary btn--add-to-cart">
            <i className="fas fa-shopping-cart"></i>
            В КОРЗИНУ
          </button>
          <button className="btn btn--icon btn--favorite" aria-label="Добавить в избранное">
            <i className="far fa-heart"></i>
          </button>
        </div>
        
        <div className="delivery-info">
          <div className="delivery-info__header">
            <i className="fas fa-truck"></i>
            <span>Доставка по Омск</span>
          </div>
          <p className="delivery-info__details">
            <strong>Курьером или самовывоз</strong><br/>
            Сроки доставки отобразятся в корзине, стоимость доставки рассчитывается индивидуально
          </p>
        </div>
        
        <div className="additional-actions">
          <button className="btn btn--secondary btn--full-width">
            <i className="fas fa-images"></i>
            ЗАПРОСИТЬ ФОТО И ВИДЕО
          </button>
          <p className="additional-actions__note">
            Наш менеджер отправит вам дополнительные фото и видео товара
          </p>
          <button className="btn btn--outline btn--full-width">
            <i className="fas fa-belt"></i>
            ЗАКАЗАТЬ РЕМЕНЬ
          </button>
        </div>
      </section>

      <section className="product-details">
        <div className="product-tabs">
          <nav className="tabs__nav">
            <button className="tab-btn active" data-tab="description">ОПИСАНИЕ</button>
            <button className="tab-btn" data-tab="warranty">ГАРАНТИЯ</button>
            <button className="tab-btn" data-tab="availability">НАЛИЧИЕ</button>
            <button className="tab-btn" data-tab="delivery">ДОСТАВКА</button>
            <button className="tab-btn" data-tab="payment">ОПЛАТА</button>
            <button className="tab-btn" data-tab="reviews">ОТЗЫВЫ</button>
          </nav>
          
          <div className="tabs__content">
            <div className="tab-pane active" id="description">
              <div className="details-grid">
                <div className="details-table">
                  <table className="specs-table">
                    <tbody>
                      <tr><td>Артикул</td><td>6239485/2025</td></tr>
                      <tr><td>Тип изделия</td><td>Часы наручные</td></tr>
                      <tr><td>Марка</td><td>Слава</td></tr>
                      <tr><td>Коллекция</td><td>Инстинкт</td></tr>
                      <tr><td>Пол</td><td>Женские</td></tr>
                      <tr><td>Механизм</td><td>Кварцевые</td></tr>
                      <tr><td>Корпус</td><td>Латунь, IP покрытие</td></tr>
                      <tr><td>Стекло</td><td>Сапфировое</td></tr>
                      <tr><td>Браслет</td><td>Кожа</td></tr>
                      <tr><td>Водозащита</td><td>3 атм</td></tr>
                      <tr><td>Размер/Диаметр, мм</td><td>34</td></tr>
                      <tr><td>Толщина, мм</td><td>8</td></tr>
                      <tr><td>Оформление</td><td>Кристалы</td></tr>
                      <tr><td>Страна-производитель</td><td>Россия</td></tr>
                      <tr><td>Цвет циферблата</td><td>Белый</td></tr>
                      <tr><td>Гарантия</td><td>12 месяцев</td></tr>
                      <tr><td>Доп. референция</td><td>6239485/2025</td></tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="details-description">
                  <p>Женские часы Слава Инстинкт 6239485/2025 — это элегантный и стильный аксессуар, который станет идеальным дополнением к вашему образу. Модель из коллекции «Инстинкт» сочетает в себе классический дизайн, современные технологии и изысканные детали, что делает её прекрасным выбором для повседневного ношения и для особых случаев.</p>
                  <p>Эти часы отличаются высоким качеством сборки и использованием премиальных материалов. Сапфировое стекло обеспечивает защиту от царапин, а водозащита 3 атм позволяет не снимать часы во время дождя или мытья рук.</p>
                  <div className="brand-logo">
                    <img src="https://via.placeholder.com/80x40?text=СЛАВА" alt="Логотип бренда Слава"/>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="tab-pane" id="warranty">
              <h3>Гарантия производителя</h3>
              <p>Гарантийный срок на часы составляет 12 месяцев с момента покупки. Гарантия распространяется на механизм и материалы корпуса.</p>
            </div>
            
            <div className="tab-pane" id="availability">
              <h3>Наличие в магазинах</h3>
              <p>Товар в наличии в 5 магазинах города Омск. Доступен для самовывоза сегодня.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>


  <FooterMain/>
  {/*<!-- JavaScript -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Переключение изображений в галерее
      const thumbnailButtons = document.querySelectorAll('.thumbnail-btn');
      const mainImage = document.getElementById('mainProductImage');
      const favoriteButton = document.querySelector('.btn--favorite');
      
      thumbnailButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Удаляем активный класс у всех кнопок
          thumbnailButtons.forEach(btn => btn.classNameList.remove('active'));
          
          // Добавляем активный класс текущей кнопке
          this.classNameList.add('active');
          
          // Обновляем основное изображение
          const newImageSrc = this.getAttribute('data-image');
          if (newImageSrc) {
            mainImage.src = newImageSrc;
            mainImage.alt = this.querySelector('img').alt;
          }
        });
      });
      
      // Переключение вкладок
      const tabButtons = document.querySelectorAll('.tab-btn');
      const tabPanes = document.querySelectorAll('.tab-pane');
      
      tabButtons.forEach(button => {
        button.addEventListener('click', function() {
          const tabId = this.getAttribute('data-tab');
          
          // Удаляем активный класс у всех кнопок и панелей
          tabButtons.forEach(btn => btn.classNameList.remove('active'));
          tabPanes.forEach(pane => pane.classNameList.remove('active'));
          
          // Добавляем активный класс текущей кнопке и соответствующей панели
          this.classNameList.add('active');
          document.getElementById(tabId).classNameList.add('active');
        });
      });
      
      // Избранное
      favoriteButton.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (icon.classNameList.contains('far')) {
          icon.classNameList.remove('far');
          icon.classNameList.add('fas');
          this.style.color = '#e74c3c';
        } else {
          icon.classNameList.remove('fas');
          icon.classNameList.add('far');
          this.style.color = '';
        }
      });
      
      // Добавление в корзину
      const addToCartButton = document.querySelector('.btn--add-to-cart');
      addToCartButton.addEventListener('click', function() {
        const originalText = this.innerHTML;
        this.innerHTML = '<i className="fas fa-check"></i> ДОБАВЛЕНО';
        this.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.style.backgroundColor = '';
        }, 2000);
        
        // Здесь обычно отправляется запрос на сервер
        console.log('Товар добавлен в корзину');
      });
    });
  </script>*/}
    </div>
    )
}
export default WatchPage;