import React from "react";
import '../style/Catalog.css'


//Здесь должна быть логика подгрузки списка часов из БД и провильная вставка их в таблицу
function Catalog(){

  return (
    <div>Catalog

      <h1>Каталог часов</h1>
  <br/>
  
  <div class="block_filters">
    <div class="filters">
      <a href="#" class="filter" id="prise" onclick="alert_stop()">ЦЕНА</a>
      <a href="#" class="filter" id="mark">МАРКА</a>
      <a href="#" class="filter" id="pol">ПОЛ</a>
      <a href="#" class="filter" id="mechanism">МЕХАНИЗМ</a>
      <a href="#" class="filter" id="other">ДРУГИЕ ФИЛЬТРЫ</a>
      <a href="#" class="filter" id="new">НОВИНКА</a>
      <a href="#" class="filter" id="sale">СКИДКА</a>
      <a href="#" class="filter" id="stock">В НАЛИЧИИ</a>
      <a href="#" class="filter" id="stock_in_shop">В НАЛИЧИИ В МАГАЗИНАХ</a>
    </div>
    <div class="line"></div>
    <div class="catalog-grid" id="">
      <div class="catalog-item">
        <a href="item.html" class="item-click">
          <img src="/img/item1.png" alt="" srcset="" class="img_item"/>
          <label class="item-name">ЧАСЫ СЛАВА ИНСТИНКТ 6239485/2025</label>
          <label for="" class="prise">5 863р</label>
        </a>  
          <input type="button" value="Купить" class="button-pay" id="b-pay" onclick="alert_stop()"/>
        <a href="#" class="compaer">Добавить к сравнению</a>
      </div>
      <div class="catalog-item">
        <a href="item.html" class="item-click">
          <img src="/img/item1.png" alt="" srcset="" class="img_item"/>
          <label class="item-name">ЧАСЫ СЛАВА ИНСТИНКТ 6239485/2025</label>
          <label for="" class="prise">5 863р</label>
        </a>  
          <input type="button" value="Купить" class="button-pay" id="b-pay" onclick="alert_stop()"/>
        <a href="#" class="compaer">Добавить к сравнению</a>
      </div>
      <div class="catalog-item">
        <a href="item.html" class="item-click">
          <img src="/img/item1.png" alt="" srcset="" class="img_item"/>
          <label class="item-name">ЧАСЫ СЛАВА ИНСТИНКТ 6239485/2025</label>
          <label for="" class="prise">5 863р</label>
        </a>  
          <input type="button" value="Купить" class="button-pay" id="b-pay" onclick="alert_stop()"/>
        <a href="#" class="compaer">Добавить к сравнению</a>
      </div>
      <div class="catalog-item">
        <a href="item.html" class="item-click">
          <img src="/img/item1.png" alt="" srcset="" class="img_item"/>
          <label class="item-name">ЧАСЫ СЛАВА ИНСТИНКТ 6239485/2025</label>
          <label for="" class="prise">5 863р</label>
        </a>  
          <input type="button" value="Купить" class="button-pay" id="b-pay" onclick="alert_stop()"/>
        <a href="#" class="compaer">Добавить к сравнению</a>
      </div>
    </div>
  </div>









      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>


    </div>
  )
};

export default Catalog;