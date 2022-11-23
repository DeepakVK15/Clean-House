from .database import db


class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    area = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    price = db.Column(db.Float, nullable=False)
    time_slots = db.Column(db.ARRAY(db.String), nullable=False)
    status = db.Column(db.String, nullable=False, default="ACTIVE")
    location = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
