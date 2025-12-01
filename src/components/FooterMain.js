import React from "react";
import '../style/FooterMain.css'

function FooterMain(){
  // Получаем текущий год для копирайта
  const currentYear = new Date().getFullYear();

  return(
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>О нас</h3>
          <p>Whatch — премиальный магазин часов, предлагающий эксклюзивные коллекции от лучших мировых брендов. Мы гарантируем оригинальность и высокое качество каждого экземпляра.</p>
        </div>

        <div className="footer-section contact">
          <h3>Контакты</h3>
          <p>
            <i className="icon location"></i> ул. Часовая, 42, г. Москва
          </p>
          <p>
            <i className="icon phone"></i> +7 (999) 123-45-67
          </p>
          <p>
            <i className="icon phone"></i> +7 (495) 987-65-43
          </p>
          <p>
            <i className="icon email"></i> info@whatch.ru
          </p>
        </div>

        <div className="footer-section links">
          <h3>Полезные ссылки</h3>
          <ul>
            <li><a href="#">Оплата и доставка</a></li>
            <li><a href="#">Гарантия и сервис</a></li>
            <li><a href="#">Возврат и обмен</a></li>
            <li><a href="#">Политика конфиденциальности</a></li>
          </ul>
        </div>

        <div className="footer-section subscribe">
          <h3>Подписка на новости</h3>
          <p>Подпишитесь на нашу рассылку, чтобы получать новости о скидках и специальных предложениях</p>
          <form>
            <input type="email" placeholder="Введите ваш email" required />
            <button type="submit">Подписаться</button>
          </form>
          <div className="social-icons">
            <a href="#" className="social-icon vk"></a>
            <a href="#" className="social-icon tg"></a>
            <a href="#" className="social-icon wa"></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p> {currentYear} Whatch — магазин премиальных часов. Все права защищены.</p>
        <p>Сайт разработан для учебного проекта. Все совпадения с реальными магазинами случайны.</p>
      </div>
    </footer>
  )
}

export default FooterMain;