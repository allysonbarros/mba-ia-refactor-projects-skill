from flask import Blueprint
from controllers import user_controller

user_bp = Blueprint("usuarios", __name__)

user_bp.add_url_rule(
    "/usuarios", "listar_usuarios", user_controller.listar_usuarios, methods=["GET"]
)
user_bp.add_url_rule(
    "/usuarios/<int:id>", "buscar_usuario", user_controller.buscar_usuario, methods=["GET"]
)
user_bp.add_url_rule(
    "/usuarios", "criar_usuario", user_controller.criar_usuario, methods=["POST"]
)
user_bp.add_url_rule(
    "/login", "login", user_controller.login, methods=["POST"]
)
