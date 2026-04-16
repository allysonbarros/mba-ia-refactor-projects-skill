from flask import Flask
from flask_cors import CORS
from database import db
from config.settings import Config
from views.task_routes import task_bp
from views.user_routes import user_bp
from views.report_routes import report_bp
from middlewares.error_handler import register_error_handlers
from datetime import datetime, timezone

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
register_error_handlers(app)

app.register_blueprint(task_bp)
app.register_blueprint(user_bp)
app.register_blueprint(report_bp)


@app.route('/health')
def health():
    return {'status': 'ok', 'timestamp': str(datetime.now(timezone.utc))}


@app.route('/')
def index():
    return {'message': 'Task Manager API', 'version': '1.0'}


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
