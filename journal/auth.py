from flask import Blueprint, request, jsonify
from .models import db, User
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password') # In a real app, you'd have a proper password flow
    plan_type = data.get('plan_type')

    if not username or not email or not password or not plan_type:
        return jsonify({"msg": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already taken"}), 400

    hashed_password = generate_password_hash(password)
    
    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        plan_type=plan_type
    )
    
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)
    
    return jsonify(access_token=access_token), 201
