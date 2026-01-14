// [UX FIX] Heuristic #1: Visibility of System Status - Added loading state and button disable
// [UX FIX] Heuristic #5: Error Prevention - Added client-side validation
// [UX FIX] Heuristic #9: Help Users Recognize, Diagnose, and Recover from Errors - Replaced alert() with inline error messages
// [UX FIX] Heuristic #3: User Control and Freedom - Added back to home link

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import link from '../link.js'
import '../style/LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  // [UX FIX] Heuristic #1: Added loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // [UX FIX] Heuristic #9: Added error state for user-friendly messages
  const [error, setError] = useState('');
  
  // [UX FIX] Heuristic #5: Added validation errors
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    password: ''
  });

  // [UX FIX] Heuristic #5: Client-side validation function
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Username validation
    if (!username.trim()) {
      errors.username = 'Логин обязателен для заполнения';
      isValid = false;
    } else if (username.length < 3) {
      errors.username = 'Логин должен содержать минимум 3 символа';
      isValid = false;
    } else if (username.length > 20) {
      errors.username = 'Логин не должен превышать 20 символов';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = 'Логин может содержать только буквы, цифры и подчеркивание';
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = 'Пароль обязателен для заполнения';
      isValid = false;
    } else if (password.length < 5) {
      errors.password = 'Пароль должен содержать минимум 5 символов';
      isValid = false;
    } else if (password.length > 50) {
      errors.password = 'Пароль не должен превышать 50 символов';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // [UX FIX] Heuristic #5: Real-time validation on blur
  const handleUsernameBlur = () => {
    if (username.trim() && username.length < 3) {
      setValidationErrors(prev => ({
        ...prev,
        username: 'Логин должен содержать минимум 3 символа'
      }));
    } else if (username.trim() && !/^[a-zA-Z0-9_]+$/.test(username)) {
      setValidationErrors(prev => ({
        ...prev,
        username: 'Логин может содержать только буквы, цифры и подчеркивание'
      }));
    } else {
      setValidationErrors(prev => ({
        ...prev,
        username: ''
      }));
    }
  };

  const handlePasswordBlur = () => {
    if (password && password.length < 5) {
      setValidationErrors(prev => ({
        ...prev,
        password: 'Пароль должен содержать минимум 5 символов'
      }));
    } else {
      setValidationErrors(prev => ({
        ...prev,
        password: ''
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // [UX FIX] Heuristic #5: Validate before submit
    if (!validateForm()) {
      return;
    }

    // [UX FIX] Heuristic #4: Prevent double submission
    if (isSubmitting) {
      return;
    }

    // [UX FIX] Heuristic #1: Set loading state
    setIsSubmitting(true);
    setError('');

    const dataToSend = {
      time: Date.now(),
      login: username,
      password: password
    };

    try {
      const response = await axios.post(link.b +'/api/login', dataToSend);

      if (response.data.success) { // !
        const token = response.data.token;
        localStorage.setItem('token', token);
        
        setTimeout(() => {
          navigate(response.data.redirect_to);
        }, 3000);
      } else {
        setError('Неправильный логин или пароль. Пожалуйста, проверьте введенные данные и попробуйте снова.');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      
      if (error.response?.status === 401) {
        setError('Неправильный логин или пароль. Пожалуйста, проверьте введенные данные.');
      } else if (error.response?.status === 500) {
        setError('Ошибка сервера. Пожалуйста, попробуйте позже или обратитесь в службу поддержки.');
      } else if (error.request) {
        setError('Не удалось подключиться к серверу. Проверьте подключение к интернету и попробуйте снова.' + error.request);
      } else {
        setError('Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.');
      }
    } finally {
      // [UX FIX] Heuristic #1: Always reset loading state
      setIsSubmitting(false);
    }
  };

  const handleYandexLogin = () => {
    const clientId = '02d8da195df945fdbb9a4fbe55f58a33';
    const redirectUri = link.f + '/auth/yandex/callback';
    const state = Math.random().toString(36).substring(7);
    
    localStorage.setItem('oauth_state', state);
    
    const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
    window.location.href = authUrl;
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        {/* [UX FIX] Heuristic #3: User Control and Freedom - Added back link */}
        <a 
          href="/" 
          className="back-link"
          style={{
            display: 'inline-block',
            marginBottom: '20px',
            color: '#d90000',
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.2s'
          }}
        >
          ← Вернуться на главную
        </a>

        <h2>Вход в систему</h2>

        {/* [UX FIX] Heuristic #9: Display general error message */}
        {error && (
          <div 
            className="error-banner"
            role="alert"
            style={{
              padding: '12px 15px',
              marginBottom: '20px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          >
            {error}
          </div>
        )}

        {/* [UX FIX] Heuristic #5: Username field with validation */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              // Clear validation error on change
              if (validationErrors.username) {
                setValidationErrors(prev => ({ ...prev, username: '' }));
              }
            }}
            onBlur={handleUsernameBlur}
            disabled={isSubmitting}
            required
            aria-label="Логин"
            aria-invalid={validationErrors.username ? 'true' : 'false'}
            aria-describedby={validationErrors.username ? 'username-error' : undefined}
            style={{
              borderColor: validationErrors.username ? '#c33' : undefined
            }}
          />
          {/* [UX FIX] Heuristic #9: Display validation error */}
          {validationErrors.username && (
            <span 
              id="username-error"
              className="error-message"
              role="alert"
              style={{
                display: 'block',
                marginTop: '6px',
                fontSize: '13px',
                color: '#c33'
              }}
            >
              {validationErrors.username}
            </span>
          )}
        </div>

        {/* [UX FIX] Heuristic #5: Password field with validation */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              // Clear validation error on change
              if (validationErrors.password) {
                setValidationErrors(prev => ({ ...prev, password: '' }));
              }
            }}
            onBlur={handlePasswordBlur}
            disabled={isSubmitting}
            required
            aria-label="Пароль"
            aria-invalid={validationErrors.password ? 'true' : 'false'}
            aria-describedby={validationErrors.password ? 'password-error' : undefined}
            style={{
              borderColor: validationErrors.password ? '#c33' : undefined
            }}
          />
          {/* [UX FIX] Heuristic #9: Display validation error */}
          {validationErrors.password && (
            <span 
              id="password-error"
              className="error-message"
              role="alert"
              style={{
                display: 'block',
                marginTop: '6px',
                fontSize: '13px',
                color: '#c33'
              }}
            >
              {validationErrors.password}
            </span>
          )}
        </div>

        {/* [UX FIX] Heuristic #1: Button with loading state */}
        <button 
          type="submit" 
          className='button'
          disabled={isSubmitting}
          style={{
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            position: 'relative'
          }}
        >
          {isSubmitting ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span 
                className="spinner-small"
                style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}
              ></span>
              Вход...
            </span>
          ) : (
            'Войти'
          )}
        </button>

        <button 
          type="button" 
          className='button yandex-btn' 
          onClick={handleYandexLogin}
          disabled={isSubmitting}
          style={{
            marginTop: '15px',
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          Войти через Яндекс ID
        </button>

        {/* [UX FIX] Heuristic #10: Help and Documentation - Added hint */}
        <p style={{
          marginTop: '20px',
          fontSize: '13px',
          color: '#666',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Логин должен содержать от 3 до 20 символов (буквы, цифры, подчеркивание).<br/>
          Пароль должен содержать минимум 5 символов.
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
