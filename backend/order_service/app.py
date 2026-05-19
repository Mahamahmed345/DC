# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from pymongo import MongoClient

# app = Flask(__name__)
# CORS(app)

# client = MongoClient("mongodb://localhost:27017/")
# db = client["order_db"]
# orders = db["orders"]

# @app.route("/")
# def home():
#     return "Order Service Running"

# @app.route('/create-order', methods=['POST'])
# def create_order():
#     data = request.json
#     orders.insert_one(data)
#     return jsonify({"message": "Order created"})

# if __name__ == "__main__":
#     app.run(port=5002)

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from supabase_client import supabase

app = Flask(__name__)
CORS(app)

@app.route("/order/create", methods=["POST"])
def create_order():
    data = request.json
    user_id = data["user_id"]

    cart_items = supabase.table("cart").select("*").eq("user_id", user_id).execute().data

    total = 0

    order = supabase.table("orders").insert({
        "user_id": user_id,
        "total_price": 0,
        "status": "pending"
    }).execute().data[0]

    order_id = order["id"]

    for item in cart_items:
        product = supabase.table("products").select("*").eq("id", item["product_id"]).execute().data[0]

        total += product["price"] * item["quantity"]

        supabase.table("order_items").insert({
            "order_id": order_id,
            "product_id": item["product_id"],
            "quantity": item["quantity"],
            "price": product["price"]
        }).execute()

    supabase.table("orders").update({
        "total_price": total
    }).eq("id", order_id).execute()

    return {
        "message": "Order created",
        "order_id": order_id,
        "total": total
    }

@app.route("/orders/<user_id>")
def get_orders(user_id):
    return supabase.table("orders").select("*").eq("user_id", user_id).execute().data

if __name__ == '__main__':
    app.run(port=5003, debug=True)