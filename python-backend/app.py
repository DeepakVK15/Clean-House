import datetime

from flask import Flask, request, jsonify, make_response
from models import database, user_model, service_model, service_request_model, feedback_model
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
# app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://test:password@localhost/cleaning"
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:password@localhost:5432/cleaning"

database.db.init_app(app)

with app.app_context():
    database.db.create_all()


# Route to create a new user
@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()

    user = user_model.User.query.filter_by(email=data["email"]).first()
    if not user:
        new_user = user_model.User(
            email=data["email"],
            password=generate_password_hash(data["password"]),
            user_type=data["user_type"],
            address=data["address"],
            phone=data["phone"],
        )
        database.db.session.add(new_user)
        database.db.session.commit()
        return make_response("User created", 201)
    else:
        return make_response("User already exists", 202)


# Route to login a user
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = user_model.User.query.filter_by(email=data["email"]).first()
    if user:
        if check_password_hash(user.password, data["password"]):
            return make_response("Login successful", 200)
        else:
            return make_response("Incorrect password", 401)
    else:
        return make_response("User does not exist", 404)


# Route to get list of users
@app.route("/users", methods=["GET"])
def get_users():
    users = user_model.User.query.all()
    result = []

    for user in users:
        user_data = {}
        user_data["id"] = user.id
        user_data["email"] = user.email
        user_data["user_type"] = user.user_type
        user_data["address"] = user.address
        user_data["phone"] = user.phone
        result.append(user_data)

    return jsonify({"users": result})


# Route to create a new service
@app.route("/services", methods=["POST"])
def create_service():
    data = request.get_json()

    if "user_id" not in data or "start_date" not in data \
            or "end_date" not in data or "start_time" not in data or "end_time" not in data:
        return make_response("Missing data", 400)

    user = user_model.User.query.filter_by(id=data["user_id"]).first()

    if not user:
        return make_response("User does not exist", 404)

    if user.user_type != "VENDOR":
        return make_response("User is not a vendor", 401)

    services = data["services"]

    start_hour = int(data["start_time"].split(":")[0])
    end_hour = int(data["end_time"].split(":")[0])

    start_date = datetime.datetime.strptime(data["start_date"], "%Y/%m/%d")
    end_date = datetime.datetime.strptime(data["end_date"], "%Y/%m/%d")

    time_delta = datetime.timedelta(days=1)

    # Create service for each day and each hour
    while start_date <= end_date:
        for hour in range(start_hour, end_hour + 1):
            for service in services:
                new_service = service_model.Service(
                    service_type=service["service_type"],
                    description=service["description"],
                    date=start_date,
                    time=f"{hour}:00",
                    price=service["price"],
                    location=service["location"],
                    user_id=data["user_id"],
                )
                database.db.session.add(new_service)
        start_date += time_delta

    database.db.session.commit()

    return make_response("Service created", 201)


# Route to book a service
@app.route("/services/book", methods=["POST"])
def book_service():
    data = request.get_json()

    user = user_model.User.query.filter_by(id=data["user_id"]).first()

    if not user:
        return make_response("User does not exist", 404)

    if user.user_type != "CUSTOMER":
        return make_response("User is not a customer", 401)

    service = service_model.Service.query.filter_by(
        id=data["service_id"]).first()

    if not service:
        return make_response("Service does not exist", 404)

    if service.status != "ACTIVE":
        return make_response("Service is not active", 401)

    new_service_request = service_request_model.ServiceRequest(
        service_id=data["service_id"],
        customer_id=data["user_id"],
        image=data["image"]
    )
    database.db.session.add(new_service_request)

    # Update service status to BOOKED
    service.status = "BOOKED"

    database.db.session.commit()
    return make_response("Service booked", 201)


# Route to create feedback
@app.route("/feedback", methods=["POST"])
def create_feedback():
    data = request.get_json()

    user = user_model.User.query.filter_by(id=data["user_id"]).first()

    if not user:
        return make_response("User does not exist", 404)

    if user.user_type == "VENDOR":
        return make_response("Vendors cannot create feedback", 401)

    service_request = service_request_model.ServiceRequest.query.filter_by(
        id=data["service_request_id"]
    ).first()
    if service_request:
        new_feedback = feedback_model.Feedback(
            service_request_id=data["service_request_id"],
            feedback=data["feedback"],
            rating=data["rating"],
            image=data["image"],
        )
        database.db.session.add(new_feedback)
        database.db.session.commit()
        return make_response("Feedback created", 201)
    else:
        return make_response("Service request does not exist", 404)


if __name__ == "__main__":
    app.run(port=8080, debug=True)
