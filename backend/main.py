from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


@app.route('/')
def hello():
  return 'hello_world'

@app.route('/api')
def get_data():
  data={
    "messages": "Прив, бро"

  }
  return data

if __name__ == '__main__':
  app.run(debug=True)