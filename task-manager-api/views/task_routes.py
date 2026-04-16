from flask import Blueprint, request, jsonify
from controllers.task_controller import TaskController

task_bp = Blueprint('tasks', __name__)


@task_bp.route('/tasks', methods=['GET'])
def get_tasks():
    result, status = TaskController.get_all_tasks()
    return jsonify(result), status


@task_bp.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    result, status = TaskController.get_task(task_id)
    return jsonify(result), status


@task_bp.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    result, status = TaskController.create_task(data)
    return jsonify(result), status


@task_bp.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    result, status = TaskController.update_task(task_id, data)
    return jsonify(result), status


@task_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    result, status = TaskController.delete_task(task_id)
    return jsonify(result), status


@task_bp.route('/tasks/search', methods=['GET'])
def search_tasks():
    result, status = TaskController.search_tasks(request.args)
    return jsonify(result), status


@task_bp.route('/tasks/stats', methods=['GET'])
def get_stats():
    result, status = TaskController.get_stats()
    return jsonify(result), status
