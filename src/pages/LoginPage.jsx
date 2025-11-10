import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  let token = '';
  // 2. Обработчик отправки формы
  const handleSubmit = async (event) => {
    let milliseconds = Date.now();
    event.preventDefault(); 
    
    console.log('Попытка авторизации с данными:');
    console.log('Логин:', username);
    console.log('Пароль:', password);
    console.log('Время:', milliseconds)

    const dataToSend = {
      time: milliseconds,
      login: username,
      password: password
    };

    try {
      const response = await axios.post('http://localhost:5000/api/login', dataToSend);
      console.log('Data submitted successfully:', response.data);

      if(response.data.success){
        console.log("Успешный вход, перенаправление...");
        navigate(response.data.redirect_to);
        token = response.data.token;
        localStorage.setItem('token',token); // отправка токена в localStoreg
        console.log('Токен отправленый в localStorage:', token)
      }

    } catch (error) {
      console.error('Error submitting data:', error);
  }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        
        <h2>Вход в систему</h2>

        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button 
          type="submit" 
          className='button'
        >
          Войти
        </button>
      </form>
    </div>
  );
}

export default LoginPage;