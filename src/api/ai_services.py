
import os
import openai

openai.api_key = os.environ.get("OPENAI_API_KEY")

class AIService:
    @staticmethod
    def predict_loan_approval(customer_data):
        """
        Uses OpenAI GPT-4 to predict loan approval rates based on customer data.
        :param customer_data: Dictionary or string containing customer information.
        :return: Predicted approval probability or error message.
        """
        prompt = (
            f"Given the following customer data:\n{customer_data}\n"
            "Provide the loan approval probability as a percentage (e.g., 85%).\n"
            "For example, if the customer is highly likely to be approved, respond with '90%'.\n"
            "If the data is insufficient to make a prediction, respond with 'Unable to predict'."
        )

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100
            )
            return response.choices[0].message['content']
        except Exception as e:
            return f"Error predicting loan approval: {str(e)}"

    @staticmethod  
    def ai_credit_limit_insights(customer_data):
        """
        Uses OpenAI GPT-4 to generate AI-driven credit limit recommendations.
        :param customer_data: Dictionary or string containing customer financial history.
        :return: Credit limit recommendation or error message.
        """
        prompt = (
            f"Given the following customer financial history:\n{customer_data}\n"
            "Please provide a recommended credit limit.\n"
            "For example, if the recommended credit limit is $5,000, respond with '$5,000'.\n"
            "If the data is insufficient, provide a general suggestion based on the data given.\n"
            "For instance, you could respond with something like:\n"
            "- 'Based on your income and debts, you have a high chance of approval, approximately 75%.'\n"
            "- 'With the provided information, a precise probability can't be determined. However, ensure you have a good income-to-debt ratio for better chances.'"
        )

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100
            )
            return response.choices[0].message['content']
        except Exception as e:
            return f"Error generating credit limit insights: {str(e)}"