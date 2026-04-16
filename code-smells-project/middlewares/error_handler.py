import logging
from flask import jsonify

logger = logging.getLogger(__name__)


def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"erro": "Requisição inválida", "sucesso": False}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"erro": "Recurso não encontrado", "sucesso": False}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({"erro": "Método não permitido", "sucesso": False}), 405

    @app.errorhandler(500)
    def internal_error(error):
        logger.error("Internal server error: %s", error)
        return jsonify({"erro": "Erro interno do servidor", "sucesso": False}), 500
