from .database import db


class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)

    booking_date = db.Column(db.Date, nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey(
        "service.id"), nullable=False)
    customer_id = db.Column(
        db.Integer, db.ForeignKey("user.id"), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    image = db.Column(db.String)
    status = db.Column(db.String, nullable=False, default="CREATED")
