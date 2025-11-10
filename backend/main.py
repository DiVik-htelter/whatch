from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import json
import adminInfo
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
    else: return jsonify({'success': False}), 200
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

if __name__ == '__main__':
  app.run(debug=True)