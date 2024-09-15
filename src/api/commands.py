
import click
from api.models import db, User, DebitCard, CreditCard, Loan
from werkzeug.security import generate_password_hash
from random import randint
from datetime import date, timedelta

def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):

            hashed_password = generate_password_hash("123456")

            user = User(
                username=f"test_user{x}",
                email=f"test_user{x}@test.com",
                password=hashed_password,
            )
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

            debit_card = DebitCard(
                card_number=f"DEBIT{x}{randint(1000,9999)}",
                expiration_date=date.today() + timedelta(days=365*2),
                balance=round(randint(1000, 5000) + randint(0, 99) / 100.0, 2),
                user_id=user.id
            )
            db.session.add(debit_card)

            credit_card = CreditCard(
                card_number=f"CREDIT{x}{randint(1000, 9999)}",
                expiration_date=date.today() + timedelta(days=365*2),
                credit_limit=round(randint(5000, 15000) + randint(0, 99) / 100.0, 2),
                current_balance=round(randint(1000, 5000) + randint(0, 99) / 100.0, 2),
                user_id=user.id
            )
            db.session.add(credit_card)

            loan_types = ['personal', 'mortgage', 'auto']
            for loan_type in loan_types:
                loan = Loan(
                    loan_type=loan_type,
                    amount=round(randint(10000, 50000) + randint(0, 99) / 100.0, 2),
                    interest_rate=round(randint(2, 10) + randint(0, 99) / 100.0, 2),
                    start_date=date.today(),
                    end_date=date.today() + timedelta(days=365 * 5),
                    user_id=user.id
                )
                db.session.add(loan)

            db.session.commit()
            print(f"User: {user.email} created with debit and credit cards and loans.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        insert_test_users(5)
        print("Test data inserted.")