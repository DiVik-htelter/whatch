from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import adminInfo
import watches_data  # Импортируем модуль для работы с данными часов
import requests  # Добавьте эту строку для работы с HTTP запросами

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

static_folder = '..\src\img'

# импорт json и перевод его в строку 
adminStr = json.loads(json.dumps(adminInfo.adminJson))

loginAdmin = adminStr['login']
passwordAdmin = adminStr['password']
token = 'NoNameToken'

# Конфигурация Яндекс OAuth
YANDEX_CLIENT_ID = '02d8da195df945fdbb9a4fbe55f58a33'
YANDEX_CLIENT_SECRET = '0c2470aa0a2a4db3b311bb96cf7586bd'
YANDEX_REDIRECT_URI = 'http://localhost:3000/auth/yandex/callback'


@app.route('/api/img')
def getImg():
  global static_folder
  return send_from_directory(static_folder,'images.png')

@app.route('/api/login', methods=['POST']) 
def chekLogin():
  dataJson = json.dumps(request.get_json()) # получение данных запроса
  print(dataJson)
  dataReq = json.loads(dataJson)
  loginReq = dataReq['login']
  passwordReq = dataReq['password']
  timeReq = dataReq['time']
  try:
    if (loginReq == loginAdmin and passwordReq == passwordAdmin):
      print('Успешный вход')
      global token
      token = str(adminInfo.newToken(timeReq, loginReq,passwordReq))

      return jsonify({'success': True, 'redirect_to': '/admin', 'token':token}), 200
    else: 
      return jsonify({'success': False}), 200
  except Exception as e:
    print(e)

# Новый endpoint для авторизации через Яндекс
@app.route('/api/yandex-auth', methods=['POST'])
def yandex_auth():
    try:
        # Получаем код авторизации от фронтенда
        code = request.json.get('code')
        if not code:
            return jsonify({'success': False, 'error': 'No code provided'}), 400
        
        # Обменяем код на access token у Яндекс
        token_url = 'https://oauth.yandex.ru/token'
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': YANDEX_CLIENT_ID,
            'client_secret': YANDEX_CLIENT_SECRET
        }
        token_response = requests.post(token_url, data=token_data)
        token_json = token_response.json()
        
        if 'access_token' not in token_json:
            return jsonify({'success': False, 'error': 'Failed to get access token'}), 400
        
        access_token = token_json['access_token']
        
        # Получаем информацию о пользователе
        user_info_url = 'https://login.yandex.ru/info'
        headers = {'Authorization': f'OAuth {access_token}'}
        user_response = requests.get(user_info_url, headers=headers)
        user_info = user_response.json()
        
        user_email = user_info.get('default_email', '')
        user_id = user_info.get('id', '')
        
        # Создаем свой токен для пользователя
        import time
        milliseconds = int(time.time() * 1000)
        
        global token
        token = str(adminInfo.newToken(milliseconds, f"yandex_{user_id}", "yandex_auth"))
        
        return jsonify({
            'success': True, 
            'token': token, 
            'redirect_to': '/admin',
            'user_info': {
                'email': user_email,
                'id': user_id
            }
        }), 200
        
    except Exception as e:
        print(f"Yandex auth error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
  
# запрос на сервер на проверку токена
@app.route('/api/checktoken', methods=['POST'])
def chekToken():
  tokenReq = json.dumps(request.get_json())
  tokenStr = json.loads(tokenReq)
  print(tokenStr['token']+ ' : '+ token)
  if (tokenStr['token'] == token):
    return {'authorization': True}, 200
  else: return {'authorization': False}, 200


# API для работы с часами

@app.route('/api/watches', methods=['GET'])
def get_watches():
  """Получение всех моделей часов"""
  all_watches = watches_data.get_all_watches()
  return jsonify(all_watches)

@app.route('/api/watches/<watch_id>', methods=['GET'])
def get_watch(watch_id):
  """Получение конкретной модели часов по ID"""
  watch = watches_data.get_watch_by_id(watch_id)
  if watch:
    return jsonify(watch)
  else:
    return jsonify({"error": "Часы не найдены"}), 404

@app.route('/api/watches', methods=['POST'])
def add_watch():
  """Проверяем токен для авторизации"""
  auth_header = request.headers.get('Authorization')
  if not auth_header or auth_header != f'Bearer {token}':
    return jsonify({"error": "Unauthorized"}), 401
    
  # Добавление новой модели часов
  watch_data = request.get_json()
  if not watch_data:
    return jsonify({"error": "Неверный формат данных"}), 400
  
  result = watches_data.add_watch(watch_data)
  return jsonify(result), 201

@app.route('/api/watches/<watch_id>', methods=['PUT'])
def update_watch(watch_id):
  # Проверяем токен для авторизации
  auth_header = request.headers.get('Authorization')
  if not auth_header or auth_header != f'Bearer {token}':
    return jsonify({"error": "Unauthorized"}), 401
    
  # Обновление модели часов
  watch_data = request.get_json()
  if not watch_data:
    return jsonify({"error": "Неверный формат данных"}), 400
  
  result = watches_data.update_watch(watch_id, watch_data)
  if result:
    return jsonify(result)
  else:
    return jsonify({"error": "Часы не найдены"}), 404

@app.route('/api/watches/<watch_id>', methods=['DELETE'])
def delete_watch(watch_id):
  # Проверяем токен для авторизации
  auth_header = request.headers.get('Authorization')
  if not auth_header or auth_header != f'Bearer {token}':
    return jsonify({"error": "Unauthorized"}), 401
    
  # Удаление модели часов
  result = watches_data.delete_watch(watch_id)
  if result:
    return jsonify(result)
  else:
    return jsonify({"error": "Часы не найдены"}), 404


if __name__ == '__main__':
  app.run(debug=True)