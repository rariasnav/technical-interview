const getState = ({ getActions, setStore }) => {
	const baseURL = process.env.BACKEND_URL + "/api";

	return {
		store: {			
			user_data: null,
			debit_cards: [],
			credit_cards: [],
			loans: []
		},
		actions: {
			signup: async (formData) => {
				try {
					const requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(formData)
					};
					const response = await fetch(`${baseURL}/signup`, requestOptions);
					const data = await response.json();
					if (response.ok) {
						return { success: true };
					} else {
						return { error: data.msg || 'Server error' };
					}
				} catch (error) {
					throw new Error(error.message);
				}			
			},
			login: async (formData) => {				
				try {
					const requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(formData)
					};

					const response = await fetch(`${baseURL}/login`, requestOptions);
					if (!response.ok) {
						throw new Error(`Login failed ${response.statusText}`);
					}

					const data = await response.json();
					return data.access_token;
				} catch (error) {
					throw new Error(error.message);
				}
			},
			logout: async () => {
				localStorage.removeItem('token');
				setStore({ user_data: null })
			},
			getSession: async () => {
				try {
					const requestOptions = {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'							
						}
					};
					const response = await fetch(`${baseURL}/session`, requestOptions);
					if (!response.ok) {
						throw new Error(`Failed to fetch session: ${response.statusText}`)
					}

					const data = await response.json();
					setStore({ user_data: data })
				} catch (error) {
					console.error('Error fetching session data:', error);
				}
			},
			getDebitCards: async () => {
				try {
					const requestOptions = {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						}
					};
					const response = await fetch(`${baseURL}/debit_cards`, requestOptions);
					const data = await response.json();
					if (response.ok) {
						setStore({ debit_cards: data })
					}
				} catch (error) {
					console.error("Error fetching debit cards", error);
				}
			},
			createDebitCard: async (cardData) => {
				try {
					const requestOptions = {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
						},
						body: JSON.stringify(cardData)
					};
					const response = await fetch(`${baseURL}/debit_cards`, requestOptions);
					if (response.ok) {
						getActions().getDebitCards();
					}
				} catch (error) {
					console.error("Error creating debit card", error);
				}
			},
			updateDebitCard: async (id, cardData) => {
				try {
					const requestOptions = {
						method: 'PUT',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
						},
						body: JSON.stringify(cardData)
					}; 
					const response = await fetch(`${baseURL}/debit_cards/${id}`, requestOptions);
					if (response.ok) {
						getActions().getDebitCards();
					}
				} catch (error) {
					console.error("Error updating debit card", error);
				}
			},
			deleteDebitCard: async (id) => {
				try {
					const requestOptions = {
						method: 'DELETE',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
						}
					}; 
					const response = await fetch(`${baseURL}/debit_cards/${id}`, requestOptions);
					if (response.ok) {
						getActions().getDebitCards();
					}
				} catch (error) {
					console.error("Error deleting debit card", error);
				}
			},
			getCreditCards: async () => {
				try {
					const requestOptions = {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						}
					};
					const response = await fetch(`${baseURL}/credit_cards`, requestOptions);
					const data = await response.json();
					if (response.ok) {
						setStore({ credit_cards: data })
					}
				} catch (error) {
					console.error("Error fetching credit cards", error);
				}
			},
			createCreditCard: async (cardData) => {
				try {
					const requestOptions = {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(cardData)
					};
					const response = await fetch(`${baseURL}/credit_cards`, requestOptions);
					if (response.ok) {
						getActions().getCreditCards();
					}
				} catch (error) {
					console.error("Error creating credit card", error);					
				}				
			},
			updateCreditCard: async (id, cardData) => {
				try {
					const requestOptions = {
						method: 'PUT',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(cardData)
					};
					const response = await fetch(`${baseURL}/credit_cards/${id}`, requestOptions);
					if (response.ok) {
						getActions().getCreditCards();
					}
				} catch (error) {
					console.error("Error updating credit card", error)
				}
			},
			deleteCreditCard: async (id) => {
				try {
					const requestOptions = {
						method: 'DELETE',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						}
					};
					const response = await fetch(`${baseURL}/credit_cards/${id}`, requestOptions);
					if (response.ok) {
						getActions().getCreditCards();
					}
				} catch (error) {
					console.error("Error deleting credit card", error)
				}				
			},
			getLoans: async () => {
				try {
					const requestOptions = {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						}
					};
					const response = await fetch(`${baseURL}/loans`, requestOptions);
					const data = await response.json();
					if (response.ok) {
						setStore({ loans: data });
					}
				} catch (error) {
					console.error("Error fetching loans", error);
				}
			},
			createLoan: async (loanData) => {
				try {
					const requestOptions = {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(loanData)
					};
					const response = await fetch(`${baseURL}/loans`, requestOptions);
					if (response.ok) {
						getActions().getLoans();
					}
				} catch (error) {
					console.error("Error creating loan", error);
				}
			},
			updateLoan: async (id, loanData) => {
				try {
					const requestOptions = {
						method: 'PUT',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(loanData)
					};
					const response = await fetch(`${baseURL}/loans/${id}`, requestOptions);
					if (response.ok) {
						getActions().getLoans();
					}
				} catch (error) {
					console.error("Error updating loan", error);
				}
			},
			deleteLoan: async (id) => {
				try {
					const requestOptions = {
						method: 'DELETE',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						}
					};
					const response = await fetch(`${baseURL}/loans/${id}`, requestOptions);
					if (response.ok) {
						getActions().getLoans();
					}
				} catch (error) {
					console.error("Error deleting loan", error);
				}
			},
			getTotalLoansAndLimits: async () => {
				try {
					const response = await fetch(`${baseURL}/api_total_loans_and_limits`);
					if (response.ok) {
						const data = await response.json();
						return data;
					}
				} catch (error) {
					console.error("Error fetching total loans and limits", error);
				}
				return null;
			},
			getCustomerUsageAnalytics: async () => {
				try {
					const response = await fetch(`${baseURL}/api_customer_usage_analytics`);
					if (response.ok) {
						const data = await response.json();
						return data;
					}
				} catch (error) {
					console.error("Error fetching customer usage analytics", error);
				}
				return null;
			},
			getLoanRepaymentInsights: async () => {
				try {
					const response = await fetch(`${baseURL}/api_loan_repayment_insights`);
					if (response.ok) {
						const data = await response.json();
						return data;
					}
				} catch (error) {
					console.error("Error fetching loan repayment insights", error);
				}
				return null;
			},
			predictLoanApproval: async (customerData) => {
				try {
					const requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(customerData),
					};
					const response = await fetch(`${baseURL}/predict_loan_approval`, requestOptions);
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const data = await response.json();
					return data['loan_approval_probability'];
				} catch (error) {
					console.error("Error predicting loan approval", error);
				}
			},
			getCreditLimitInsights: async (customerData) => {
				try {
					const requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(customerData),
					};
					const response = await fetch(`${baseURL}/credit_limit_insights`, requestOptions);
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const data = await response.json();
					return data['credit_limit_recommendation'];
				} catch (error) {
					console.error("Error generating credit limit insights", error);
				}
			},
		}
	};
};

export default getState;
