import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function YandexCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const state = params.get('state');
      
      const savedState = localStorage.getItem('yandex_auth_state');
      
      if (state !== savedState) {
        console.error('State mismatch');
        navigate('/login');
        return;
      }

      if (code) {
        try {
          const response = await axios.post('http://localhost:5000/api/yandex-auth', {
            code: code
          });
          
          if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            navigate('/admin');
          } else {
            alert('Ошибка авторизации через Яндекс');
            navigate('/login');
          }
        } catch (error) {
          console.error('Yandex auth error:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="container">
      <div className="form">
        <h2>Авторизация через Яндекс...</h2>
        <p>Пожалуйста, подождите.</p>
      </div>
    </div>
  );
}

export default YandexCallback;