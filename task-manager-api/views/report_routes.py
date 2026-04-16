from flask import Blueprint, request, jsonify
from controllers.report_controller import ReportController

report_bp = Blueprint('reports', __name__)


@report_bp.route('/reports/summary', methods=['GET'])
def summary_report():
    result, status = ReportController.summary_report()
    return jsonify(result), status


@report_bp.route('/reports/user/<int:user_id>', methods=['GET'])
def user_report(user_id):
    result, status = ReportController.user_report(user_id)
    return jsonify(result), status


@report_bp.route('/categories', methods=['GET'])
def get_categories():
    result, status = ReportController.get_categories()
    return jsonify(result), status


@report_bp.route('/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    result, status = ReportController.create_category(data)
    return jsonify(result), status


@report_bp.route('/categories/<int:cat_id>', methods=['PUT'])
def update_category(cat_id):
    data = request.get_json()
    result, status = ReportController.update_category(cat_id, data)
    return jsonify(result), status


@report_bp.route('/categories/<int:cat_id>', methods=['DELETE'])
def delete_category(cat_id):
    result, status = ReportController.delete_category(cat_id)
    return jsonify(result), status
