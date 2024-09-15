"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, DebitCard, CreditCard, Loan
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import re

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not email or not password or not username:
        return jsonify({"msg": "All fields are required"}), 400    

    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, email):
        return jsonify({"error": "Invalid email format"}), 400
    
    if len(password) < 6:
        return jsonify({"msg": "Password must be at least 6 characters"}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already in use"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already in use"}), 400
    
    hashed_password = generate_password_hash(password)
    new_user = User(
        username=username,
        email=email,
        password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created"}), 201
    

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user.is_active:
        return jsonify({"msg": "Account not found"}), 403
    
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Invalid email or password"}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200


@api.route('/session', methods=['GET'])
@jwt_required()
def get_session():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify(user.serialize()), 200


@api.route('/update_password', methods=['PUT'])
@jwt_required()
def update_password():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_password = data.get('new_password')

    if not new_password:
        return jsonify({"msg": "New password is required"}), 400
    
    user = User.query.get(user_id)
    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"msg": "Password updated successfully"}), 200


@api.route('/deactivate', methods=["PUT"])
@jwt_required()
def deactivate_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    user.is_active = False
    db.session.commit()

    return jsonify({"msg": "Account deactivated successfully"}), 200

@api.route('/debit_cards', methods=['POST'])
@jwt_required()
def create_debit_card():
    user_id = get_jwt_identity()
    data = request.get_json()
    card_number = data.get('card_number')
    expiration_date = data.get('expiration_date')
    balance = data.get('balance')

    if not all([user_id, card_number, expiration_date, balance]):
        return jsonify({"msg": "All fields are required"}), 400
    
    if DebitCard.query.filter_by(card_number=card_number).first():
        return jsonify({"msg": "Card number already in use"}), 400
    
    new_card = DebitCard(
        card_number=card_number,
        expiration_date=expiration_date,
        balance=balance,
        user_id=user_id
    )
    db.session.add(new_card)
    db.session.commit()

    return jsonify({"msg": "Debit card created successfully"}), 201


@api.route('/debit_cards', methods=['GET'])
@jwt_required()
def get_debit_cards():
    user_id = get_jwt_identity()
    cards = DebitCard.query.filter_by(user_id=user_id, is_active=True).all()
    return jsonify([card.serialize() for card in cards]), 200


@api.route('/debit_cards/<int:id>', methods=['PUT'])
@jwt_required()
def update_debit_card(id):
    data = request.get_json()
    card_number = data.get('card_number')
    expiration_date = data.get('expiration_date')
    balance = data.get('balance')    

    card = DebitCard.query.get(id)
    if not card or not card.is_active:
        return jsonify({"msg": "Debit Card not found or inactive"}), 404    

    if card_number:
        card.card_number = card_number
    if expiration_date:
        card.expiration_date = expiration_date
    if balance:
        card.balance = balance

    db.session.commit()
    return jsonify({"msg": "Debit Card updated successfully"}), 200


@api.route('/debit_cards/<int:id>', methods=['DELETE'])
@jwt_required()
def deactivate_debit_card(id):
    card = DebitCard.query.get(id)
    if not card or not card.is_active:
        return jsonify({"msg": "Debit Card not found or already inactive"}), 404
    
    card.is_active = False
    db.session.commit()
    return jsonify({"msg": "Debit Card deactivated successfully"}), 200


@api.route('/credit_cards', methods=['POST'])
@jwt_required()
def create_credit_card():
    user_id = get_jwt_identity()
    data = request.get_json()
    card_number = data.get('card_number')
    expiration_date = data.get('expiration_date')
    credit_limit = data.get('credit_limit')
    current_balance = data.get('current_balance')

    if not all([user_id, card_number, expiration_date, credit_limit, current_balance]):
        return jsonify({"msg": "All fields are required"}), 400
    
    if CreditCard.query.filter_by(card_number=card_number).first():
        return jsonify({"msg": "Card number already in use"}), 400
    
    new_card = CreditCard(
        card_number=card_number,
        expiration_date=expiration_date,
        credit_limit=credit_limit,
        current_balance=current_balance,
        user_id=user_id
    )
    db.session.add(new_card)
    db.session.commit()

    return jsonify({"msg": "Credit card created"}), 201


@api.route('/credit_cards', methods=['GET'])
@jwt_required()
def get_credit_cards():
    user_id = get_jwt_identity()
    cards = CreditCard.query.filter_by(user_id=user_id, is_active=True).all()
    return jsonify([card.serialize() for card in cards]), 200


@api.route('/credit_cards/<int:id>', methods=['PUT'])
@jwt_required()
def update_credit_card(id):
    data = request.get_json()
    card_number = data.get('card_number')
    expiration_date  = data.get('expiration_date')
    credit_limit  = data.get('credit_limit')
    current_balance  = data.get('current_balance')

    card = CreditCard.query.get(id)
    if not card or not card.is_active:
        return jsonify({"msg": "Credit card not found or inactive"}), 404
    
    if card_number:
        card.card_number = card_number
    if expiration_date:
        card.expiration_date = expiration_date
    if credit_limit:
        card.credit_limit = credit_limit
    if current_balance:
        card.current_balance = current_balance

    db.session.commit()
    return jsonify({"msg": "Credit card updated"}), 200


@api.route('/credit_cards/<int:id>', methods=['DELETE'])
@jwt_required()
def deactivate_credit_card(id):
    card = CreditCard.query.get(id)
    if not card or not card.is_active:
        return jsonify({"msg": "Credit card not found or already inactive"}), 404
    
    card.is_active = False
    db.session.commit()
    return jsonify({"msg": "Credit card deactivated"})


@api.route('/loans', methods=['POST'])
@jwt_required()
def create_loan():
    user_id = get_jwt_identity()
    data = request.get_json()
    loan_type = data.get('loan_type')
    amount = data.get('amount')
    interest_rate = data.get('interest_rate')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    if not all([loan_type, amount, interest_rate, start_date, end_date]):
        return jsonify({"msg": "All fields are required"}), 400

    valid_loan_types = ['personal', 'mortgage', 'auto']
    if loan_type not in valid_loan_types:
        return jsonify({"msg": f"Invalid loan_type. Must be one of {valid_loan_types}"}), 400
    
    new_loan = Loan(
        loan_type=loan_type,
        amount=amount,
        interest_rate=interest_rate,
        start_date=start_date,
        end_date=end_date,
        user_id=user_id
    )
    db.session.add(new_loan)
    db.session.commit()

    return jsonify({"msg": "Loan created"}), 201


@api.route('/loans', methods=['GET'])
@jwt_required()
def get_loans():
    user_id = get_jwt_identity()
    loans = Loan.query.filter_by(user_id=user_id, is_active=True).all()
    return jsonify([loan.serialize() for loan in loans]), 200


@api.route('/loans/<int:id>', methods=['PUT'])
@jwt_required()
def update_loan(id):
    data = request.get_json()
    loan_type= data.get('loan_type')
    amount = data.get('amount')
    interest_rate = data.get('interest_rate')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    loan = Loan.query.get(id)
    if not loan or not loan.is_active:
        return jsonify({"msg": "Loan not found or inactive"}), 404
    
    if loan_type:
        loan.loan_type = loan_type
    if amount:
        loan.amount = amount
    if interest_rate:
        loan.interest_rate = interest_rate
    if start_date:
        loan.start_date = start_date
    if end_date:
        loan.end_date = end_date

    db.session.commit()
    return jsonify({"msg": "Loan updated"}), 200


@api.route('/loans/<int:id>', methods=['DELETE'])
@jwt_required()
def deactivate_loan(id):
    loan = Loan.query.get(id)
    if not loan or not loan.is_active:
        return jsonify({"msg": "Loan not found or already inactive"}), 400
    
    loan.is_active = False
    db.session.commit()
    return jsonify({"msg": "Loan deactivated"}), 200


@api.route('/api_total_loans_and_limits', methods=['GET'])
def get_total_loans_and_limits():
    total_loans = db.session.query(db.func.sum(Loan.amount)).scalar() or 0
    total_credit_limits = db.session.query(db.func.sum(CreditCard.credit_limit)).scalar() or 0

    total_loans = round(total_loans, 2)
    total_credit_limits = round(total_credit_limits, 2)

    return jsonify({
        'total_loans': total_loans,
        'total_credit_limits': total_credit_limits
    })


@api.route('/api_customer_usage_analytics', methods=['GET'])
def get_customer_usage_analitycs():
    total_debit_cards = db.session.query(db.func.count(DebitCard.id)).scalar() or 0
    total_credit_cards = db.session.query(db.func.count(CreditCard.id)).scalar() or 0
    total_balance_debit = db.session.query(db.func.sum(DebitCard.balance)).scalar() or 0
    total_balance_credit = db.session.query(db.func.sum(CreditCard.current_balance)).scalar() or 0

    total_balance_debit = round(total_balance_debit, 2)
    total_balance_credit = round(total_balance_credit, 2)

    return jsonify({
        'total_debit_cards': total_debit_cards,
        'total_credit_cards': total_credit_cards,
        'total_balance_debit': total_balance_debit,
        'total_balance_credit': total_balance_credit
    })


@api.route('/api_loan_repayment_insights', methods=['GET'])
def get_loan_repayment_insights():
    total_loans = db.session.query(db.func.count(Loan.id)).scalar() or 0
    total_repaid = db.session.query(db.func.sum(Loan.amount)).filter(Loan.is_active == False).scalar() or 0
    total_pending = total_loans - total_repaid

    return jsonify({
        'total_loans': total_loans,
        'total_repaid': total_repaid,
        'total_pending': total_pending
    })