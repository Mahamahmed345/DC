from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname((os.path.abspath(__file__)))))

from supabase_client import supabase

app = Flask(__name__)
CORS(app)

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json

    email = data["email"]
    password = data["password"]
    full_name = data.get("full_name")

    # Supabase Auth Signup
    response = supabase.auth.sign_up({
        "email": email,
        "password": password
    })

    if response.user is None:
        return jsonify({"error": "Signup failed"}), 400

    user_id = response.user.id

    # Insert into profiles table
    supabase.table("profiles").insert({
        "id": user_id,
        "email": email,
        "full_name": full_name
    }).execute()

    return jsonify({"message": "User created successfully"})
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data["email"]
    password = data["password"]

    response = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })

    if response.user is None:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": response.user.id,
        "email": response.user.email,
        "access_token": response.session.access_token
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)