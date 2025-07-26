from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlite3 import Connection as SQLite3Connection

db = SQLAlchemy()

# Enforce foreign key constraints on SQLite
@event.listens_for(Engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, SQLite3Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    plan_type = db.Column(db.String(20), nullable=False, default='free') # e.g., 'free', 'premium', 'enterprise'
    trades = db.relationship('Trade', backref='user', lazy=True)

class Trade(db.Model):
    __tablename__ = 'trades'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    asset = db.Column(db.String(50), nullable=False)
    direction = db.Column(db.String(4), nullable=False)  # 'buy' or 'sell'
    entry_price = db.Column(db.Float, nullable=False)
    exit_price = db.Column(db.Float, nullable=False)
    sl = db.Column(db.Float, nullable=True)  # Stop Loss
    tp = db.Column(db.Float, nullable=True)  # Take Profit
    lot_size = db.Column(db.Float, nullable=False)
    trade_duration = db.Column(db.String(50), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    outcome = db.Column(db.String(4), nullable=False)  # 'win' or 'loss'
    strategy_tag = db.Column(db.String(100), nullable=True)
    prop_firm = db.Column(db.String(100), nullable=True)
    screenshot_url = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f'<Trade {self.id} on {self.asset}>'
