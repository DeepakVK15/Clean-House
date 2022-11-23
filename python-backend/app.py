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

    user = user_model.User.query.filter_by(id=data["user_id"]).first()

    if not user:
        return make_response("User does not exist", 404)

    if user.user_type != "VENDOR":
        return make_response("User is not a vendor", 401)

    new_service = service_model.Service(
        area=data["area"],
        name=data["name"],
        description=data["description"],
        price=data["price"],
        time_slots=data["time_slots"],
        location=data["location"],
        user_id=data["user_id"],
    )
    database.db.session.add(new_service)
    database.db.session.commit()
    return make_response("Service created", 201)


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
