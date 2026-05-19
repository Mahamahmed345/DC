from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from supabase_client import supabase

app = Flask(__name__)
CORS(app)


# ----------------------------
# PRODUCTS
# ----------------------------
@app.route("/products", methods=["GET"])
def get_products():
    response = supabase.table("products").select("*").execute()
    return jsonify(response.data)


# ----------------------------
# ADD TO CART
# ----------------------------
@app.route("/cart/add", methods=["POST"])
def add_to_cart():
    data = request.json

    user_id = data["user_id"]
    product_id = data["product_id"]
    quantity = data.get("quantity", 1)

    # check existing item
    existing = supabase.table("cart") \
        .select("*") \
        .eq("user_id", user_id) \
        .eq("product_id", product_id) \
        .execute().data

    if existing:
        new_qty = existing[0]["quantity"] + quantity

        supabase.table("cart") \
            .update({"quantity": new_qty}) \
            .eq("id", existing[0]["id"]) \
            .execute()

        return jsonify({"message": "Quantity updated"})

    supabase.table("cart").insert({
        "user_id": user_id,
        "product_id": product_id,
        "quantity": quantity
    }).execute()

    return jsonify({"message": "Added to cart"})


# ----------------------------
# GET CART (ENRICHED)
# ----------------------------
@app.route("/cart/<user_id>", methods=["GET"])
def get_cart(user_id):
    cart_items = supabase.table("cart") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute().data

    enriched_cart = []

    for item in cart_items:
        product = supabase.table("products") \
            .select("*") \
            .eq("id", item["product_id"]) \
            .execute().data

        if product:
            p = product[0]

            enriched_cart.append({
                "id": item["id"],
                "user_id": item["user_id"],
                "product_id": item["product_id"],
                "quantity": item["quantity"],
                "name": p["name"],
                "image_url": p["image_url"],
                "price": p["price"]
            })

    return jsonify(enriched_cart)


# ----------------------------
# UPDATE CART QUANTITY (NEW)
# ----------------------------
@app.route("/cart/update", methods=["PUT"])
def update_cart():
    data = request.json

    user_id = data["user_id"]
    product_id = data["product_id"]
    quantity = data["quantity"]

    response = supabase.table("cart") \
        .update({"quantity": quantity}) \
        .eq("user_id", user_id) \
        .eq("product_id", product_id) \
        .execute()

    return jsonify({"message": "Cart updated"})


# ----------------------------
# REMOVE SINGLE ITEM (NEW BETTER VERSION)
# ----------------------------
@app.route("/cart/remove", methods=["DELETE"])
def remove_item():
    data = request.json

    user_id = data["user_id"]
    product_id = data["product_id"]

    supabase.table("cart") \
        .delete() \
        .eq("user_id", user_id) \
        .eq("product_id", product_id) \
        .execute()

    return jsonify({"message": "Item removed"})


# ----------------------------
# CLEAR CART
# ----------------------------
@app.route("/cart/clear/<user_id>", methods=["DELETE"])
def clear_cart(user_id):
    supabase.table("cart") \
        .delete() \
        .eq("user_id", user_id) \
        .execute()

    return jsonify({"message": "Cart cleared"})


# ----------------------------
# OPTIONAL OLD DELETE (KEEP FOR DEBUG)
# ----------------------------
@app.route("/cart/delete/<cart_id>", methods=["DELETE"])
def delete_item(cart_id):
    supabase.table("cart").delete().eq("id", cart_id).execute()
    return jsonify({"message": "Deleted"})


# ----------------------------
# RUN SERVER
# ----------------------------
if __name__ == "__main__":
    app.run(port=5001, debug=True)
