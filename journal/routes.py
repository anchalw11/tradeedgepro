from flask import Blueprint, request, jsonify, send_file
from .models import db, Trade
from .schemas import trade_schema, trades_schema
from .auth_middleware import enterprise_required
from .utils import calculate_dashboard_stats, save_screenshot, generate_csv
from flask_jwt_extended import get_jwt_identity
from marshmallow import ValidationError
import io

journal_bp = Blueprint('journal_bp', __name__)

@journal_bp.route('/api/journal/add-trade', methods=['POST'])
@enterprise_required
def add_trade():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input data provided"}), 400

    try:
        # Validate and deserialize input
        data = trade_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    user_id = get_jwt_identity()
    
    new_trade = Trade(
        user_id=user_id,
        date=data['date'],
        asset=data['asset'],
        direction=data['direction'],
        entry_price=data['entry_price'],
        exit_price=data['exit_price'],
        sl=data.get('sl'),
        tp=data.get('tp'),
        lot_size=data['lot_size'],
        trade_duration=data.get('trade_duration'),
        notes=data.get('notes'),
        outcome=data['outcome'],
        strategy_tag=data.get('strategy_tag'),
        prop_firm=data.get('prop_firm'),
        screenshot_url=data.get('screenshot_url')
    )

    db.session.add(new_trade)
    db.session.commit()

    return jsonify(trade_schema.dump(new_trade)), 201

@journal_bp.route('/api/journal/dashboard', methods=['GET'])
@enterprise_required
def dashboard():
    user_id = get_jwt_identity()
    stats = calculate_dashboard_stats(user_id)
    return jsonify(stats), 200

@journal_bp.route('/api/journal/filter', methods=['GET'])
@enterprise_required
def filter_trades():
    user_id = get_jwt_identity()
    query = Trade.query.filter_by(user_id=user_id)

    # Filtering
    if 'start_date' in request.args:
        query = query.filter(Trade.date >= request.args['start_date'])
    if 'end_date' in request.args:
        query = query.filter(Trade.date <= request.args['end_date'])
    if 'pair' in request.args:
        query = query.filter(Trade.asset == request.args['pair'])
    if 'prop_firm' in request.args:
        query = query.filter(Trade.prop_firm == request.args['prop_firm'])
    if 'outcome' in request.args:
        query = query.filter(Trade.outcome == request.args['outcome'])
    if 'strategy_tag' in request.args:
        query = query.filter(Trade.strategy_tag == request.args['strategy_tag'])

    # Pagination
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    paginated_trades = query.paginate(page=page, per_page=per_page, error_out=False)
    
    result = {
        "trades": trades_schema.dump(paginated_trades.items),
        "total": paginated_trades.total,
        "pages": paginated_trades.pages,
        "current_page": paginated_trades.page
    }

    return jsonify(result), 200

@journal_bp.route('/api/journal/upload-screenshot', methods=['POST'])
@enterprise_required
def upload_screenshot():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({"msg": "No image data provided"}), 400

    trade_id = data.get('trade_id')
    if not trade_id:
        return jsonify({"msg": "trade_id is required"}), 400

    user_id = get_jwt_identity()
    trade = Trade.query.filter_by(id=trade_id, user_id=user_id).first()
    if not trade:
        return jsonify({"msg": "Trade not found or not owned by user"}), 404

    image_path = save_screenshot(data['image'])
    if not image_path:
        return jsonify({"msg": "Failed to save screenshot"}), 500

    trade.screenshot_url = image_path
    db.session.commit()

    return jsonify({"msg": "Screenshot uploaded successfully", "path": image_path}), 200

@journal_bp.route('/api/journal/export', methods=['GET'])
@enterprise_required
def export_trades():
    user_id = get_jwt_identity()
    query = Trade.query.filter_by(user_id=user_id)

    # Apply filters similar to the filter endpoint
    if 'start_date' in request.args:
        query = query.filter(Trade.date >= request.args['start_date'])
    if 'end_date' in request.args:
        query = query.filter(Trade.date <= request.args['end_date'])
    if 'pair' in request.args:
        query = query.filter(Trade.asset == request.args['pair'])
    if 'prop_firm' in request.args:
        query = query.filter(Trade.prop_firm == request.args['prop_firm'])
    if 'outcome' in request.args:
        query = query.filter(Trade.outcome == request.args['outcome'])
    if 'strategy_tag' in request.args:
        query = query.filter(Trade.strategy_tag == request.args['strategy_tag'])

    trades = query.all()
    
    export_format = request.args.get('format', 'csv').lower()

    if export_format == 'csv':
        csv_buffer = generate_csv(trades)
        return send_file(
            io.BytesIO(csv_buffer.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name='trade_journal.csv'
        )
    elif export_format == 'pdf':
        # PDF generation can be added here
        return jsonify({"msg": "PDF export not yet implemented"}), 501
    else:
        return jsonify({"msg": "Unsupported format"}), 400
