from flask import Flask, request, jsonify, make_response
from models import database, user, service, service_request, feedback

app = Flask(__name__)
# app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://test:password@localhost/cleaning"
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:password@localhost:5432/cleaning"

database.db.init_app(app)

with app.app_context():
    database.db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
