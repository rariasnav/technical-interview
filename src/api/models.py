from datetime import date
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ENUM

db = SQLAlchemy()

class User(db.Model):
    __tablename__='user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    start_date = db.Column(db.Date, default=date.today, nullable=False)

    debit_cards = db.relationship('DebitCard', backref='user', lazy=True)
    credit_cards = db.relationship('CreditCard', backref='user', lazy=True)
    loans = db.relationship('Loan', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "is_active": self.is_active
        }
    

class DebitCard(db.Model):
    __tablename__= 'debit_card'
    id = db.Column(db.Integer, primary_key=True)
    card_number = db.Column(db.String(16), unique=True, nullable=False)
    expiration_date = db.Column(db.Date, nullable=False)
    balance = db.Column(db.Float, nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<DebitCard {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "card_number": self.card_number,
            "expiration_date": self.expiration_date,
            "balance": self.balance,
            "user": self.user.serialize() if self.user else None
        }


class CreditCard(db.Model):
    __tablename__= 'credit_card'
    id = db.Column(db.Integer, primary_key=True)
    card_number = db.Column(db.String(16), unique=True, nullable=False)
    expiration_date = db.Column(db.Date, nullable=False)
    credit_limit = db.Column(db.Float, nullable=False)
    current_balance = db.Column(db.Float, nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<CreditCard {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "card_number": self.card_number,
            "expiration_date": self.expiration_date,
            "credit_limit": self.credit_limit,
            "current_balance": self.current_balance,
            "is_active": self.is_active,
            "user": self.user.serialize() if self.user else None
        }


loan_type_enum = ENUM('personal', 'mortgage', 'auto', name='loan_type_enum')

class Loan(db.Model):
    __tablename__= 'loan'
    id = db.Column(db.Integer, primary_key=True)
    loan_type = db.Column(loan_type_enum, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    interest_rate = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.Date, default=date.today, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Loan {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "loan_type": self.loan_type,
            "amount": self.amount,
            "interest_rate": self.interest_rate,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "is_active": self.is_active,
            "user": self.user.serialize() if self.user else None
        }