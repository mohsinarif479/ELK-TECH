from flask import Flask, request, jsonify, abort
from uuid import uuid4

app = Flask(__name__)

USERS = {}  

def is_valid_email(email: str) -> bool:
    return isinstance(email, str) and "@" in email and "." in email

@app.post("/users")
def create_user():
    data = request.get_json(silent=True) or {}

    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()

    if not username:
        return jsonify({"error": "username is required"}), 400
    if not email or not is_valid_email(email):
        return jsonify({"error": "valid email is required"}), 400

    user_id = str(uuid4())
    user = {"id": user_id, "username": username, "email": email}

    USERS[user_id] = user

    return jsonify(user), 201

@app.get("/users/<user_id>")
def get_user(user_id):
    user = USERS.get(user_id)
    if not user:
        abort(404, description="User not found")
    return jsonify(user)

@app.put("/users/<user_id>")
def update_user(user_id):
    user = USERS.get(user_id)
    if not user:
        abort(404, description="User not found")

    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()

    if not username:
        return jsonify({"error": "username is required"}), 400
    if not email or not is_valid_email(email):
        return jsonify({"error": "valid email is required"}), 400

    USERS[user_id] = {"id": user_id, "username": username, "email": email}
    return jsonify(USERS[user_id])

@app.get("/users")
def list_users():
    return jsonify(list(USERS.values()))

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": str(e)}), 404

if __name__ == "__main__":
    app.run(debug=True)
