import React, {useState} from "react";
import axios from "axios";
import '../style/Catalog.css'


//Здесь должна быть логика подгрузки списка часов из БД и провильная вставка их в таблицу
function Catalog(){

  const [watches, setWatches] = useState([])
  
  const fetchWatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/watches');
      setWatches(response.data);
    } catch (e) {
      console.error('Ошибка при загрузке часов:', e);
    }
  };
  

fetchWatches();
  
  
  return (
    <div>Catalog
      <h1>Каталог часов</h1>
    <br/>
  
  <div className="block_filters">
    <div className="filters">
      <a href="#" className="filter" id="prise">ЦЕНА</a>
      <a href="#" className="filter" id="mark">МАРКА</a>
      <a href="#" className="filter" id="pol">ПОЛ</a>
      <a href="#" className="filter" id="mechanism">МЕХАНИЗМ</a>
      <a href="#" className="filter" id="other">ДРУГИЕ ФИЛЬТРЫ</a>
      <a href="#" className="filter" id="new">НОВИНКА</a>
      <a href="#" className="filter" id="sale">СКИДКА</a>
      <a href="#" className="filter" id="stock">В НАЛИЧИИ</a>
      <a href="#" className="filter" id="stock_in_shop">В НАЛИЧИИ В МАГАЗИНАХ</a>
    </div>
    <div className="line"></div>

    <div className="catalog-grid" id="">

      {watches.map(watch => (
        <div className="catalog-item">
          <a href="item.html" className="item-click">
              {watch.imgUrl ? (
                        <img src={watch.imgUrl} alt={watch.name} className="img_item" />
                      ) : ( <img src="" className="img_item" /> )}            
            <label className="item-name">{watch.name} {watch.brand}</label>
            <label for="" className="prise">watch.prise</label>
          </a>  
            <input type="button" value="Купить" className="button-pay" id="b-pay"/>
          <a href="#" className="compaer">Добавить к сравнению</a>
        </div>
        
      ))}



      <div className="catalog-item">
        <a href="item.html" className="item-click">
          <img src="/img/item1.png" alt="" srcset="" className="img_item"/>
          <label className="item-name">ЧАСЫ СЛАВА ИНСТИНКТ 6239485/2025</label>
          <label for="" className="prise">5 863р</label>
        </a>  
          <input type="button" value="Купить" className="button-pay" id="b-pay" onclick="alert_stop()"/>
        <a href="#" className="compaer">Добавить к сравнению</a>
      </div>
      <div className="catalog-item">
        <a href="item.html" className="item-click">
          <img src="/img/item1.png" alt="" srcset="" className="img_item"/>
          <label className="item-name">ЧАСЫ СЛАВА ИНСТИНКТ 6239485/2025</label>
          <label for="" className="prise">5 863р</label>
        </a>  
          <input type="button" value="Купить" className="button-pay" id="b-pay" onclick="alert_stop()"/>
        <a href="#" className="compaer">Добавить к сравнению</a>
      </div>
      <div className="catalog-item">
        <a href="item.html" className="item-click">
          <img src="/img/item1.png" alt="" srcset="" className="img_item"/>
          <label className="item-name">ЧАСЫ СЛАВА ИНСТИНКТ 6239485/2025</label>
          <label for="" className="prise">5 863р</label>
        </a>  
          <input type="button" value="Купить" className="button-pay" id="b-pay" onclick="alert_stop()"/>
        <a href="#" className="compaer">Добавить к сравнению</a>
      </div>
    </div>
  </div>


    </div>
  )
};

export default Catalog;