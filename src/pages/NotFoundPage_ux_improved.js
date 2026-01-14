// [UX FIX] Heuristic #2: Match Between System and the Real World - Fixed unclear text "notFoundRages"
// [UX FIX] Heuristic #3: User Control and Freedom - Added navigation options
// [UX FIX] Heuristic #9: Help Users Recognize, Diagnose, and Recover from Errors - Clear error message

import React from "react";
import { Link } from "react-router-dom";
import '../style/NotFoundPage.css'

function NotFoundPage(){
  return(
    <div className="not-found-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <div className="not-found-content" style={{
        textAlign: 'center',
        maxWidth: '600px',
        background: 'white',
        padding: '60px 40px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
      }}>
        {/* [UX FIX] Heuristic #8: Aesthetic and Minimalist Design - Added visual icon */}
        <div style={{
          fontSize: '80px',
          marginBottom: '20px',
          animation: 'bounce 2s infinite'
        }}>
          🔍
        </div>

        {/* [UX FIX] Heuristic #2: Clear, user-friendly title */}
        <h1 style={{
          fontSize: '120px',
          fontWeight: '700',
          color: '#d90000',
          margin: '0',
          lineHeight: '1'
        }}>
          404
        </h1>

        <h2 style={{
          fontSize: '32px',
          fontWeight: '600',
          color: '#333',
          margin: '20px 0'
        }}>
          Страница не найдена
        </h2>

        {/* [UX FIX] Heuristic #9: Helpful explanation */}
        <p style={{
          fontSize: '18px',
          color: '#666',
          margin: '20px 0 40px',
          lineHeight: '1.6'
        }}>
          К сожалению, запрашиваемая страница не существует или была удалена.
          Возможно, вы перешли по устаревшей ссылке или ввели неправильный адрес.
        </p>

        {/* [UX FIX] Heuristic #3: User Control and Freedom - Multiple navigation options */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link 
            to="/" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#d90000',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#a00000'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#d90000'}
          >
            Вернуться на главную
          </Link>

          <Link 
            to="/" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#d90000',
              textDecoration: 'none',
              border: '1px solid #d90000',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#d90000';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#d90000';
            }}
          >
            Перейти к каталогу
          </Link>
        </div>

        {/* [UX FIX] Heuristic #10: Help and Documentation - Additional help */}
        <p style={{
          marginTop: '30px',
          fontSize: '14px',
          color: '#999'
        }}>
          Если проблема повторяется, пожалуйста, свяжитесь с нами.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;

// [UX FIX] Add CSS animation (should be added to NotFoundPage.css or global styles)
/*
@keyframes bounce {
  0%, 100% { 
    transform: translateY(0); 
  }
  50% { 
    transform: translateY(-20px); 
  }
}

@media (max-width: 768px) {
  .not-found-content h1 {
    font-size: 80px !important;
  }
  
  .not-found-content h2 {
    font-size: 24px !important;
  }
  
  .not-found-content {
    padding: 40px 20px !important;
  }
}
*/
