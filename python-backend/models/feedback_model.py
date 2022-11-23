from .database import db


class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    service_request_id = db.Column(db.Integer, db.ForeignKey(
        "service_request.id"), nullable=False)
    feedback = db.Column(db.String, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String)
