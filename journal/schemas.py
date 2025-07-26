from marshmallow import Schema, fields, validate

class TradeSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    date = fields.Date(required=True)
    asset = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    direction = fields.Str(required=True, validate=validate.OneOf(["buy", "sell"]))
    entry_price = fields.Float(required=True)
    exit_price = fields.Float(required=True)
    sl = fields.Float(allow_none=True)
    tp = fields.Float(allow_none=True)
    lot_size = fields.Float(required=True)
    trade_duration = fields.Str(allow_none=True, validate=validate.Length(max=50))
    notes = fields.Str(allow_none=True)
    outcome = fields.Str(required=True, validate=validate.OneOf(["win", "loss"]))
    strategy_tag = fields.Str(allow_none=True, validate=validate.Length(max=100))
    prop_firm = fields.Str(allow_none=True, validate=validate.Length(max=100))
    screenshot_url = fields.Str(allow_none=True, validate=validate.Length(max=255))

trade_schema = TradeSchema()
trades_schema = TradeSchema(many=True)
