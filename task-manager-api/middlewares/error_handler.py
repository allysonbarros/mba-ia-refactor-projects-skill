from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError


def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Requisição inválida'}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Recurso não encontrado'}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({'error': 'Método não permitido'}), 405

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Erro interno do servidor'}), 500

    @app.errorhandler(SQLAlchemyError)
    def handle_db_error(error):
        return jsonify({'error': 'Erro de banco de dados'}), 500
