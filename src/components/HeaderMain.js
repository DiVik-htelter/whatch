import React from "react";
import '../style/HeaderMain.css'

function HeaderMain(){

  return(
    <header>
       <div className="logo">
        <img
          src="image source"
          class="img-fluid rounded-top"
          alt=""
        /></div>
        <div>
          <button className="headBtn left">Наручные</button>
          <button className="headBtn left">Настенные</button>
          <button className="headBtn left">С кукушкой</button>
       </div>
       <div>
        {/*<input>строка поиска</input>*/}
        <button className="headBtn right">❤️</button>
        <button className="headBtn right">🗑️</button>
        <button className="headBtn right">👤</button>
       </div>
    </header>
  )
}

export default HeaderMain;