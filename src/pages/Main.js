import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import HeaderMain from '../components/HeaderMain';
import FooterMain from '../components/FooterMain';
import Catalog from '../components/Catalog';
import '../style/Main.css';



function Main(){
    
    return (
    <div className="wrapper">
      <HeaderMain/>
      <h1>Main_Page </h1>
      <Catalog/>
      <FooterMain/>
    </div>
    )
}
export default Main;