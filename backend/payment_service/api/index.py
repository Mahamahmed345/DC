from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os 
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from supabase_client import supabase
import random

app = Flask(__name__)
CORS(app)



# -----------------------------
# PAYMENT API
# -----------------------------
@app.route("/pay", methods=["POST"])
def pay():

    data = request.json

    order_id = data["order_id"]
    user_id = data["user_id"]
    amount = data["amount"]
    payment_method = data["payment_method"]

    card_last4 = None

    # -----------------------------
    # CASH ON DELIVERY
    # -----------------------------
    if payment_method == "cod":

        status = "pending"

    # -----------------------------
    # CARD PAYMENT SIMULATION
    # -----------------------------
    else:

        card_number = data["card_number"]

        # store only last 4 digits
        card_last4 = card_number[-4:]

        # simulate payment
        success = random.choices(
            [True, False],
            weights=[85, 15]
        )[0]

        status = "success" if success else "failed"

    # -----------------------------
    # SAVE PAYMENT
    # -----------------------------
    supabase.table("payments").insert({
        "order_id": order_id,
        "user_id": user_id,
        "amount": amount,
        "payment_method": payment_method,
        "card_last4": card_last4,
        "status": status
    }).execute()

    # -----------------------------
    # UPDATE ORDER STATUS
    # -----------------------------
    supabase.table("orders") \
        .update({
            "status": status
        }) \
        .eq("id", order_id) \
        .execute()

    return jsonify({
        "message": "Payment Processed",
        "status": status
    })

# -----------------------------
# TEST
# -----------------------------
@app.route("/")
def home():
    return "💳 Payment Service Running"

