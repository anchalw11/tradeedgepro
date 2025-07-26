from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from .models import User

def enterprise_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            if not user:
                return jsonify({"msg": "User not found"}), 404

            if user.plan_type != 'enterprise':
                return jsonify({"msg": "Enterprise plan required for access"}), 403
            
        except Exception as e:
            return jsonify({"msg": "Missing or invalid token", "error": str(e)}), 401
        
        return fn(*args, **kwargs)
    return wrapper
