from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .models import db
from .routes import journal_bp
from .auth import auth_bp
import os

def create_app(config_object='journal.config.DevelopmentConfig'):
    app = Flask(__name__)
    app.config.from_object(config_object)

    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}) # Adjust origins for production

    # Register blueprints
    app.register_blueprint(journal_bp)
    app.register_blueprint(auth_bp)

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    return app

def create_production_app():
    return create_app('journal.config.ProductionConfig')
