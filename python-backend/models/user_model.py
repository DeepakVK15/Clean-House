from .database import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    # public_id = db.Column(db.String, unique=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    user_type = db.Column(db.String, nullable=False)
    address = db.Column(db.String)
    phone = db.Column(db.String)
