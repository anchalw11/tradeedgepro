from .models import db, Trade
from sqlalchemy import func
import os
import base64
import uuid
import csv
import io

def save_screenshot(image_data):
    if not image_data:
        return None
    
    try:
        # Assume image_data is "data:image/png;base64,iVBORw0KGgo..."
        header, encoded = image_data.split(",", 1)
        file_extension = header.split("/")[1].split(";")[0]
        
        # Ensure the uploads directory exists
        upload_dir = 'uploads/screenshots'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
            
        # Create a unique filename
        filename = f"{uuid.uuid4().hex}.{file_extension}"
        filepath = os.path.join(upload_dir, filename)
        
        # Decode and save the file
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(encoded))
            
        return f"/{filepath}" # Return a URL-friendly path
    except Exception as e:
        print(f"Error saving screenshot: {e}")
        return None

def generate_csv(trades):
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    header = [
        'ID', 'Date', 'Asset', 'Direction', 'Entry Price', 'Exit Price', 
        'Stop Loss', 'Take Profit', 'Lot Size', 'Trade Duration', 'Notes', 
        'Outcome', 'Strategy Tag', 'Prop Firm', 'Screenshot URL'
    ]
    writer.writerow(header)
    
    # Write trade data
    for trade in trades:
        row = [
            trade.id,
            trade.date.isoformat(),
            trade.asset,
            trade.direction,
            trade.entry_price,
            trade.exit_price,
            trade.sl,
            trade.tp,
            trade.lot_size,
            trade.trade_duration,
            trade.notes,
            trade.outcome,
            trade.strategy_tag,
            trade.prop_firm,
            trade.screenshot_url
        ]
        writer.writerow(row)
        
    output.seek(0)
    return output

def calculate_dashboard_stats(user_id):
    trades = Trade.query.filter_by(user_id=user_id).all()

    if not trades:
        return {
            'win_rate': 0,
            'average_rrr': 0,
            'total_trades': 0,
            'most_used_strategy': None,
            'most_profitable_pair': None,
            'weekly_profit_percent': 0,
            'monthly_profit_percent': 0,
            'best_prop_firm_performance': None,
        }

    total_trades = len(trades)
    wins = sum(1 for t in trades if t.outcome == 'win')
    win_rate = (wins / total_trades) * 100 if total_trades > 0 else 0

    # This is a simplified RRR calculation. A real implementation would be more complex.
    total_rrr = sum((t.exit_price - t.entry_price) / (t.entry_price - t.sl) if t.direction == 'buy' and t.sl and t.entry_price > t.sl else 0 for t in trades)
    average_rrr = total_rrr / total_trades if total_trades > 0 else 0

    most_used_strategy = db.session.query(Trade.strategy_tag, func.count(Trade.strategy_tag)).filter_by(user_id=user_id).group_by(Trade.strategy_tag).order_by(func.count(Trade.strategy_tag).desc()).first()
    
    # This is a simplified profitability calculation.
    most_profitable_pair = db.session.query(Trade.asset, func.sum(Trade.exit_price - Trade.entry_price)).filter_by(user_id=user_id).group_by(Trade.asset).order_by(func.sum(Trade.exit_price - Trade.entry_price).desc()).first()

    # Weekly/Monthly profit % would require more complex logic, possibly involving account balance history.
    # This is a placeholder.
    weekly_profit_percent = 5.2 
    monthly_profit_percent = 20.8

    best_prop_firm_performance = db.session.query(Trade.prop_firm, func.count(Trade.id)).filter(Trade.user_id==user_id, Trade.outcome=='win').group_by(Trade.prop_firm).order_by(func.count(Trade.id).desc()).first()


    return {
        'win_rate': round(win_rate, 2),
        'average_rrr': round(average_rrr, 2),
        'total_trades': total_trades,
        'most_used_strategy': most_used_strategy[0] if most_used_strategy else None,
        'most_profitable_pair': most_profitable_pair[0] if most_profitable_pair else None,
        'weekly_profit_percent': weekly_profit_percent,
        'monthly_profit_percent': monthly_profit_percent,
        'best_prop_firm_performance': best_prop_firm_performance[0] if best_prop_firm_performance else None,
    }
