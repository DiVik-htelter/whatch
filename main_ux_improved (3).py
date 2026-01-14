# [UX FIX] Heuristic #14: Security & Trust - Moved OAuth credentials to environment variables
# [UX FIX] Heuristic #9: Help Users Recognize, Diagnose, and Recover from Errors - Improved error messages
# [UX FIX] Heuristic #5: Error Prevention - Added input validation

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
import json
import adminInfo
import watches_data
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, 
            static_folder='static',
            static_url_path='/static')

# CORS(app, resources={r"/api/*": {"origins": "*", "allow_headers":"*", "methods":"*"}})
CORS(app, origins=[ "https://elyse-weldless-charley.ngrok-free.dev",
                    "https://farsightedly-bibliotaphic-tam.ngrok-free.dev/",
                    "http://localhost:3000"],
allow_headers=["Content-Type", "ngrok-skip-browser-warning"],
expose_headers=["Content-Type", "Access-Control-Allow-Headers"],
methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
supports_credentials=False,
max_age=600)


# импорт json и перевод его в строку 
adminStr = json.loads(json.dumps(adminInfo.adminJson))

loginAdmin = adminStr['login']
passwordAdmin = adminStr['password']

# [UX FIX] Heuristic #14: Better naming for global token variable
current_admin_token = None  # Changed from 'NoNameToken' to None for clarity

# [UX FIX] Heuristic #14: Security - Load OAuth credentials from environment variables
YANDEX_CLIENT_ID = os.getenv('YANDEX_CLIENT_ID', '02d8da195df945fdbb9a4fbe55f58a33')
YANDEX_CLIENT_SECRET = os.getenv('YANDEX_CLIENT_SECRET')
# YANDEX_REDIRECT_URI = os.getenv('YANDEX_REDIRECT_URI', 'http://localhost:3000/auth/yandex/callback')
YANDEX_REDIRECT_URI = os.getenv('YANDEX_REDIRECT_URI', 'https://elyse-weldless-charley.ngrok-free.dev/auth/yandex/callback')

# [UX FIX] Heuristic #14: Validate that critical environment variables are set
if not YANDEX_CLIENT_SECRET:
    print("WARNING: YANDEX_CLIENT_SECRET not set in environment variables!")
    print("Please create a .env file with YANDEX_CLIENT_SECRET=your_secret_here")

#@app.route('/api/watches')
#def get_watches():
#    with open('watches.json', 'r', encoding='utf-8') as f:
#        watches = json.load(f)
    
#    # Добавляем URL для изображений
#    for watch in watches:
#        watch['image_url'] = f"/static/images/{watch['image_filename']}"
    
#    return jsonify(watches)
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", 
                           "https://elyse-weldless-charley.ngrok-free.dev")
        response.headers.add("Access-Control-Allow-Headers", 
                           "Content-Type, ngrok-skip-browser-warning, Authorization")
        response.headers.add("Access-Control-Allow-Methods", 
                           "GET, POST, PUT, DELETE, OPTIONS")
        return response, 200


@app.route('/api/login', methods=['OPTIONS'])
@cross_origin(allow_headers=['ngrok-skip-browser-warning', 'Content-Type'])
def chekLogin_options():
    response = jsonify({})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response, 200

@app.route('/api/watches', methods=['OPTIONS'])
@cross_origin(allow_headers=['ngrok-skip-browser-warning', 'Content-Type'])
def watches_options():
    response = jsonify({})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response, 200

@app.route('/api/login', methods=['POST']) 
def chekLogin():
    """Авторизация администратора"""
    try:
        # [UX FIX] Heuristic #5: Validate request data
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False, 
                'error': 'Неверный формат данных'
            }), 400
        
        loginReq = data.get('login')
        passwordReq = data.get('password')
        timeReq = data.get('time')
        
        # [UX FIX] Heuristic #5: Validate required fields
        if not loginReq or not passwordReq:
            return jsonify({
                'success': False, 
                'error': 'Логин и пароль обязательны для заполнения'
            }), 400
        
        # Check credentials
        if loginReq == loginAdmin and passwordReq == passwordAdmin:
            print('Успешный вход')
            global current_admin_token
            current_admin_token = str(adminInfo.newToken(timeReq, loginReq, passwordReq))
            
            return jsonify({
                'success': True, 
                'redirect_to': '/admin', 
                'token': current_admin_token
            }), 200
        else:
            # [UX FIX] Heuristic #9: Clear error message for failed login
            return jsonify({
                'success': False,
                'error': 'Неправильный логин или пароль'
            }), 401
            
    except KeyError as e:
        # [UX FIX] Heuristic #9: Specific error for missing fields
        return jsonify({
            'success': False, 
            'error': f'Отсутствует обязательное поле: {str(e)}'
        }), 400
    except Exception as e:
        print(f"Login error: {e}")
        # [UX FIX] Heuristic #9: Generic error message for unexpected errors
        return jsonify({
            'success': False, 
            'error': 'Произошла ошибка при входе. Попробуйте позже.'
        }), 500


@app.route('/api/yandex-auth', methods=['POST'])
def yandex_auth():
    """Авторизация через Яндекс OAuth"""
    try:
        # [UX FIX] Heuristic #5: Validate request data
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False, 
                'error': 'Неверный формат данных'
            }), 400
        
        code = data.get('code')
        if not code:
            return jsonify({
                'success': False, 
                'error': 'Код авторизации не предоставлен'
            }), 400
        
        # [UX FIX] Heuristic #14: Check if credentials are configured
        if not YANDEX_CLIENT_SECRET:
            return jsonify({
                'success': False, 
                'error': 'OAuth не настроен. Обратитесь к администратору.'
            }), 500
        
        # Exchange code for access token
        token_url = 'https://oauth.yandex.ru/token'
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': YANDEX_CLIENT_ID,
            'client_secret': YANDEX_CLIENT_SECRET
        }
        
        token_response = requests.post(token_url, data=token_data, timeout=1000)
        token_json = token_response.json()
        
        if 'access_token' not in token_json:
            # [UX FIX] Heuristic #9: User-friendly error message
            error_description = token_json.get('error_description', 'Неизвестная ошибка')
            return jsonify({
                'success': False, 
                'error': f'Не удалось получить токен доступа: {error_description}'
            }), 400
        
        access_token = token_json['access_token']
        
        # Get user information
        user_info_url = 'https://login.yandex.ru/info'
        headers = {'Authorization': f'OAuth {access_token}'}
        user_response = requests.get(user_info_url, headers=headers, timeout=1000)
        
        if user_response.status_code != 200:
            return jsonify({
                'success': False, 
                'error': 'Не удалось получить информацию о пользователе'
            }), 400
        
        user_info = user_response.json()
        user_email = user_info.get('default_email', '')
        user_id = user_info.get('id', '')
        
        # Create our own token for the user
        import time
        milliseconds = int(time.time() * 1000)
        
        global current_admin_token
        current_admin_token = str(adminInfo.newToken(milliseconds, f"yandex_{user_id}", "yandex_auth"))
        
        return jsonify({
            'success': True, 
            'token': current_admin_token, 
            'redirect_to': '/admin',
            'user_info': {
                'email': user_email,
                'id': user_id
            }
        }), 200
        
    except requests.Timeout:
        # [UX FIX] Heuristic #9: Specific error for timeout
        return jsonify({
            'success': False, 
            'error': 'Превышено время ожидания ответа от Яндекс. Попробуйте снова.'
        }), 504
    except requests.RequestException as e:
        print(f"Yandex auth request error: {e}")
        return jsonify({
            'success': False, 
            'error': 'Ошибка соединения с сервером Яндекс. Проверьте подключение к интернету.'
        }), 503
    except Exception as e:
        print(f"Yandex auth error: {e}")
        # [UX FIX] Heuristic #9: Generic error message
        return jsonify({
            'success': False, 
            'error': 'Произошла ошибка при авторизации через Яндекс. Попробуйте позже.'
        }), 500


@app.route('/api/checktoken', methods=['POST'])
def chekToken():
    """Проверка токена авторизации"""
    try:
        # [UX FIX] Heuristic #5: Validate request data
        data = request.get_json()
        if not data:
            return jsonify({'authorization': False, 'error': 'Неверный формат данных'}), 400
        
        tokenReq = data.get('token')
        if not tokenReq:
            return jsonify({'authorization': False, 'error': 'Токен не предоставлен'}), 400
        
        # Check if token matches
        if tokenReq == current_admin_token:
            return jsonify({'authorization': True}), 200
        else:
            return jsonify({'authorization': False}), 401
            
    except Exception as e:
        print(f"Token check error: {e}")
        return jsonify({
            'authorization': False, 
            'error': 'Ошибка проверки токена'
        }), 500


# API для работы с часами

@app.route('/api/watches', methods=['GET'])
def get_watches():
    """Получение всех моделей часов"""
    try:
        all_watches = watches_data.get_all_watches()
        return jsonify(all_watches), 200
    except Exception as e:
        print(f"Get watches error: {e}")
        # [UX FIX] Heuristic #9: User-friendly error message
        return jsonify({
            'error': 'Не удалось загрузить каталог часов. Попробуйте позже.'
        }), 500


@app.route('/api/watches/<watch_id>', methods=['GET'])
def get_watch(watch_id):
    """Получение конкретной модели часов по ID"""
    try:
        # [UX FIX] Heuristic #5: Validate watch_id
        if not watch_id:
            return jsonify({'error': 'ID часов не указан'}), 400
        
        watch = watches_data.get_watch_by_id(watch_id)
        if watch:
            return jsonify(watch), 200
        else:
            # [UX FIX] Heuristic #9: Clear error message
            return jsonify({
                'error': 'Часы с указанным ID не найдены'
            }), 404
            
    except Exception as e:
        print(f"Get watch error: {e}")
        return jsonify({
            'error': 'Ошибка при загрузке информации о часах'
        }), 500


@app.route('/api/watches', methods=['POST'])
def add_watch():
    """Добавление новой модели часов"""
    # [UX FIX] Heuristic #14: Check authorization
    auth_header = request.headers.get('Authorization')
    if not auth_header or auth_header != f'Bearer {current_admin_token}':
        return jsonify({
            'error': 'Требуется авторизация для выполнения этого действия'
        }), 401
    
    try:
        # [UX FIX] Heuristic #5: Validate request data
        watch_data = request.get_json()
        if not watch_data:
            return jsonify({'error': 'Данные о часах не предоставлены'}), 400
        
        # [UX FIX] Heuristic #5: Validate required fields
        required_fields = ['name', 'brand', 'price']
        missing_fields = [field for field in required_fields if field not in watch_data]
        
        if missing_fields:
            return jsonify({
                'error': f'Отсутствуют обязательные поля: {", ".join(missing_fields)}'
            }), 400
        
        # [UX FIX] Heuristic #5: Validate price is a number
        try:
            price = float(watch_data['price'])
            if price < 0:
                return jsonify({'error': 'Цена не может быть отрицательной'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Цена должна быть числом'}), 400
        
        result = watches_data.add_watch(watch_data)
        return jsonify(result), 201
        
    except Exception as e:
        print(f"Add watch error: {e}")
        return jsonify({
            'error': 'Не удалось добавить часы. Попробуйте позже.'
        }), 500


@app.route('/api/watches/<watch_id>', methods=['PUT'])
def update_watch(watch_id):
    """Обновление модели часов"""
    # [UX FIX] Heuristic #14: Check authorization
    auth_header = request.headers.get('Authorization')
    if not auth_header or auth_header != f'Bearer {current_admin_token}':
        return jsonify({
            'error': 'Требуется авторизация для выполнения этого действия'
        }), 401
    
    try:
        # [UX FIX] Heuristic #5: Validate request data
        watch_data = request.get_json()
        if not watch_data:
            return jsonify({'error': 'Данные для обновления не предоставлены'}), 400
        
        # [UX FIX] Heuristic #5: Validate price if provided
        if 'price' in watch_data:
            try:
                price = float(watch_data['price'])
                if price < 0:
                    return jsonify({'error': 'Цена не может быть отрицательной'}), 400
            except (ValueError, TypeError):
                return jsonify({'error': 'Цена должна быть числом'}), 400
        
        result = watches_data.update_watch(watch_id, watch_data)
        if result:
            return jsonify(result), 200
        else:
            return jsonify({
                'error': 'Часы с указанным ID не найдены'
            }), 404
            
    except Exception as e:
        print(f"Update watch error: {e}")
        return jsonify({
            'error': 'Не удалось обновить часы. Попробуйте позже.'
        }), 500


@app.route('/api/watches/<watch_id>', methods=['DELETE'])
def delete_watch(watch_id):
    """Удаление модели часов"""
    # [UX FIX] Heuristic #14: Check authorization
    auth_header = request.headers.get('Authorization')
    if not auth_header or auth_header != f'Bearer {current_admin_token}':
        return jsonify({
            'error': 'Требуется авторизация для выполнения этого действия'
        }), 401
    
    try:
        result = watches_data.delete_watch(watch_id)
        if result:
            return jsonify({
                'success': True,
                'message': 'Часы успешно удалены'
            }), 200
        else:
            return jsonify({
                'error': 'Часы с указанным ID не найдены'
            }), 404
            
    except Exception as e:
        print(f"Delete watch error: {e}")
        return jsonify({
            'error': 'Не удалось удалить часы. Попробуйте позже.'
        }), 500


if __name__ == '__main__':
    app.run(debug=True)


# [UX FIX] Instructions for deployment:
# 1. Create a .env file in the backend directory with the following content:
#    YANDEX_CLIENT_ID=your_client_id_here
#    YANDEX_CLIENT_SECRET=your_client_secret_here
#    YANDEX_REDIRECT_URI=http://localhost:3000/auth/yandex/callback
#
# 2. Install python-dotenv: pip install python-dotenv
#
# 3. Add .env to .gitignore to prevent committing secrets
#
# 4. Create .env.example for documentation:
#    YANDEX_CLIENT_ID=your_client_id_here
#    YANDEX_CLIENT_SECRET=your_client_secret_here
#    YANDEX_REDIRECT_URI=http://localhost:3000/auth/yandex/callback
