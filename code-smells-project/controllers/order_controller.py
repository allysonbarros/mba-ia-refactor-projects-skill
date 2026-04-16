import logging
from flask import request, jsonify
from models import order_model
from models.database import get_db

logger = logging.getLogger(__name__)

VALID_STATUSES = ["pendente", "aprovado", "enviado", "entregue", "cancelado"]


def criar_pedido():
    try:
        dados = request.get_json()

        if not dados:
            return jsonify({"erro": "Dados inválidos"}), 400

        usuario_id = dados.get("usuario_id")
        itens = dados.get("itens", [])

        if not usuario_id:
            return jsonify({"erro": "Usuario ID é obrigatório"}), 400
        if not itens or len(itens) == 0:
            return jsonify({"erro": "Pedido deve ter pelo menos 1 item"}), 400

        resultado = order_model.create(usuario_id, itens)

        if "erro" in resultado:
            return jsonify({"erro": resultado["erro"], "sucesso": False}), 400

        logger.info("Pedido %d criado para usuario %d", resultado["pedido_id"], usuario_id)
        logger.info("Notificação: Pedido recebido pelo sistema")

        return jsonify({
            "dados": resultado,
            "sucesso": True,
            "mensagem": "Pedido criado com sucesso",
        }), 201

    except Exception as e:
        logger.error("Erro ao criar pedido: %s", e)
        return jsonify({"erro": str(e)}), 500


def listar_pedidos_usuario(usuario_id):
    try:
        pedidos = order_model.get_by_user(usuario_id)
        return jsonify({"dados": pedidos, "sucesso": True}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500


def listar_todos_pedidos():
    try:
        pedidos = order_model.get_all()
        return jsonify({"dados": pedidos, "sucesso": True}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500


def atualizar_status_pedido(pedido_id):
    try:
        dados = request.get_json()
        novo_status = dados.get("status", "")

        if novo_status not in VALID_STATUSES:
            return jsonify({"erro": "Status inválido"}), 400

        order_model.update_status(pedido_id, novo_status)

        if novo_status == "aprovado":
            logger.info("Pedido %d aprovado - preparar envio", pedido_id)
        if novo_status == "cancelado":
            logger.info("Pedido %d cancelado - devolver estoque", pedido_id)

        return jsonify({"sucesso": True, "mensagem": "Status atualizado"}), 200

    except Exception as e:
        return jsonify({"erro": str(e)}), 500


def relatorio_vendas():
    try:
        relatorio = order_model.sales_report()
        return jsonify({"dados": relatorio, "sucesso": True}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500


def health_check():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT 1")
        cursor.execute("SELECT COUNT(*) FROM produtos")
        produtos = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM usuarios")
        usuarios = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM pedidos")
        pedidos = cursor.fetchone()[0]

        return jsonify({
            "status": "ok",
            "database": "connected",
            "counts": {
                "produtos": produtos,
                "usuarios": usuarios,
                "pedidos": pedidos,
            },
            "versao": "1.0.0",
            "ambiente": "producao",
        }), 200
    except Exception as e:
        return jsonify({"status": "erro", "detalhes": str(e)}), 500
