from journal import create_app
from flask import jsonify

app = create_app()

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Trading Journal API. Please use the /api/journal endpoints."})

if __name__ == '__main__':
    app.run(debug=True)
