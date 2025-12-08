import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  let token = '';
  
  const YANDEX_CLIENT_ID = '02d8da195df945fdbb9a4fbe55f58a33';
  const YANDEX_REDIRECT_URI = 'http://localhost:3000/auth/yandex/callback';

    // Функция для авторизации через Яндекс
  const handleYandexLogin = () => {
    const state = Math.random().toString(36).substring(7); // Для безопасности
    localStorage.setItem('yandex_auth_state', state);
    
    const yandexAuthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(YANDEX_REDIRECT_URI)}&state=${state}`;
    
    window.location.href = yandexAuthUrl;
  };

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
      } else {
        console.log('Неправильные данные')
        alert('Неправильный логин или пароль')
      }

    } catch (error) {
      console.error('Error submitting data:', error);
  }
  };

  return (
    <div className='container'>
      <script src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js"></script>
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
        <div className="divider">или</div>

        <button 
          type="button" 
          className='button yandex-btn'
          onClick={handleYandexLogin}
        >
          Войти через Яндекс ID
        </button>
      </form>
    </div>
  );
}

export default LoginPage;