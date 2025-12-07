import React from "react";
import '../style/HeaderMain.css'
import '../img/logo.png'
//добавить поиск по странице
//

function HeaderMain(){

  return(
    <header>
      <div className="header">
      <div className="contacts"></div>
      <div className="burger-menu"></div>
      <div className="menu">
          <div className="categori-list">
            <a href="/" className="profil">
              <div className="categori">
                <img className="logo" src="../img/logo.png" alt="" srcset=""/>
              </div>
            </a>
            <a href="/" className="categori">Наручные</a>
            <a href="/wall_clock" className="categori">Настенные</a>
            <a href="/cuckoo" className="categori">С кукушкой</a>
          </div>
          <div className="profils">

            <div className="screath">Организовать поиск</div>
            <a href="#" className="profil">❤️</a>
            <a href="#" className="profil">🗑️</a>
            <a href="/login" className="profil">👤</a>
          </div>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
    </header>
  )
}

export default HeaderMain;