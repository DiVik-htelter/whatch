import React, { useState } from "react";
import logo from '../img/logo.png'
import '../style/HeaderMain.css'
//добавить поиск по странице
//

function HeaderMain(){
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return(
    <header>
      <div className="header">
      <div className="contacts"></div>
      <div className="burger-menu"onClick={toggleMenu} role="button" tabIndex={0} aria-label="Открыть меню">
      ☰</div>
      <div className={`menu${isMenuOpen ? '.active' : ''}`}>          
        <div className="categori-list">
            <a href="/" className="profil">
              <div className="categori">
                <img className="logo" src={logo} alt="" srcset=""/>
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