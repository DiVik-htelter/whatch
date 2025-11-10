import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/LoginPage.css';

function AdminPage(){
  const [isBlocked, setBlocket]= useState(false)
  const handleSubmit = async (e) => {
  const token = localStorage.getItem('token')
    
  

    const dataToSend = {
      token: token
  };
  
  try {
    const response = await axios.post('http://localhost:5000/api/checktoken', dataToSend);
    console.log(response.data)
    console.log('Токен полученый из localStorage:', token)
    if(response.data.authorization){
      console.log('проверка пройдена')
    }

  } catch (e){
    console.error(e);
  }
};
  handleSubmit();
  return (
    <div>Страничка админки</div>
  );
}

export default AdminPage;