from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import json
import adminInfo
import watches_data  # Импортируем модуль для работы с данными часов

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# импорт json и перевод его в строку 
adminStr = json.loads(json.dumps(adminInfo.adminJson))

loginAdmin = adminStr['login']
passwordAdmin = adminStr['password']
token = 'NoNameToken'


@app.route('/')
def hello():
  return 'hello_world'

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

  
# запрос на сервер на проверку токена
@app.route('/api/checktoken', methods=['POST'])
def chekToken():
  tokenReq = json.dumps(request.get_json())
  tokenStr = json.loads(tokenReq)
  print(tokenStr['token']+ ' : '+ token)
  if (tokenStr['token'] == token):
    return {'authorization': True}, 200
  else: return {'authorization': False}, 200


@app.route('/api/data')
def get_data():
  data={
    "messages": "Прив, бро"

  }
  return data

# API для работы с часами
@app.route('/api/watches', methods=['GET'])
def get_watches():
  # Получение всех моделей часов
  all_watches = watches_data.get_all_watches()
  return jsonify(all_watches)

@app.route('/api/watches/<watch_id>', methods=['GET'])
def get_watch(watch_id):
  # Получение конкретной модели часов по ID
  watch = watches_data.get_watch_by_id(watch_id)
  if watch:
    return jsonify(watch)
  else:
    return jsonify({"error": "Часы не найдены"}), 404

@app.route('/api/watches', methods=['POST'])
def add_watch():
  # Проверяем токен для авторизации
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