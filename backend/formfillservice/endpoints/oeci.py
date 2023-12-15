

import json
import os
from flask import request, jsonify, Blueprint



bp = Blueprint('oeci', __name__, url_prefix='/oeci')

@bp.route('/', methods=['POST'])
def scrape():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    
    return jsonify({'message': 'Invalid credentials'}), 401
