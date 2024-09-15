import React, { useContext, useState } from "react";
import "../../styles/Chatbot.css";
import { Context } from "../store/appContext";

export const Chatbot = () => {
    const { actions } = useContext(Context);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [step, setStep] = useState("welcome"); 
    const [customerData, setCustomerData] = useState({});

    const handleSend = async () => {
        if (input.trim() === "") return;

        // Add user's message to chat
        setMessages([...messages, { text: input, isUser: true }]);

        if (step === "welcome") {
            setMessages([
                ...messages,
                { text: "Welcome! You have two options:\n1. Predict loan approval\n2. Get credit limit insights\n\nPlease type '1' for loan approval or '2' for credit limit insights.", isUser: false }
            ]);
            setStep("awaitingOption");
        } else if (step === "awaitingOption") {
            if (input.trim() === "1") {
                setMessages([
                    ...messages,
                    { text: "For loan approval prediction, please provide the following data:\n- Income\n- Debts\n- Credit Score", isUser: false }
                ]);
                setStep("collectLoanData");
            } else if (input.trim() === "2") {
                setMessages([
                    ...messages,
                    { text: "For credit limit insights, please provide the following data:\n- Income\n- Debts\n- Credit Score", isUser: false }
                ]);
                setStep("collectCreditLimitData");
            } else {
                setMessages([
                    ...messages,
                    { text: "Invalid option. Please type '1' for loan approval or '2' for credit limit insights.", isUser: false }
                ]);
            }
        } else if (step === "collectLoanData" || step === "collectCreditLimitData") {
            const data = input.split(',').map(item => item.trim());
            if (data.length === 3) {
                const [income, debts, creditScore] = data;
                setCustomerData({ income, debts, creditScore });

                let result;
                if (step === "collectLoanData") {
                    result = await actions.predictLoanApproval({ income, debts, creditScore });
                    setMessages([
                        ...messages,
                        { text: `Loan Approval Prediction: ${result}`, isUser: false }
                    ]);
                } else if (step === "collectCreditLimitData") {
                    result = await actions.getCreditLimitInsights({ income, debts, creditScore });
                    setMessages([
                        ...messages,
                        { text: `Credit Limit Insights: ${result}`, isUser: false }
                    ]);
                }

                setStep("welcome"); // Restart conversation
            } else {
                setMessages([
                    ...messages,
                    { text: "Please provide all required data separated by commas (Income, Debts, Credit Score).", isUser: false }
                ]);
            }
        }

        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.isUser ? 'user-message' : 'bot.message'}>
                        {msg.text}
                    </div>
                ))}                
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};