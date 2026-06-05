import { useState } from "react";
import { askAI } from "../services/aiService";
import DashboardLayout from "../layouts/DashboardLayout";

function AiCoach() {

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello 👋 I am your FitSphere AI Coach."
        }
    ]);

    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {

        if (!message.trim()) return;

        const userMessage = message;

        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: userMessage
            }
        ]);

        setMessage("");

        setLoading(true);

        try {

            const reply =
                await askAI(userMessage);

            setMessages(prev => [
                ...prev,
                {
                    sender: "bot",
                    text: reply
                }
            ]);

        } catch {

            setMessages(prev => [
                ...prev,
                {
                    sender: "bot",
                    text:
                        "Unable to connect to AI Coach."
                }
            ]);
        }

        setLoading(false);
    };

    return (

        <DashboardLayout>

            <div className="p-6">

                <h1 className="
                    text-3xl
                    font-bold
                    mb-6
                ">
                    🤖 AI Fitness Coach
                </h1>

                <div
                    className="
                    bg-white
                    rounded-xl
                    shadow
                    h-[70vh]
                    flex
                    flex-col
                    "
                >

                    <div
                        className="
                        flex-1
                        overflow-y-auto
                        p-4
                        space-y-4
                        "
                    >

                        {messages.map((msg, index) => (

                            <div
                                key={index}
                                className={
                                    msg.sender === "user"
                                        ? "text-right"
                                        : "text-left"
                                }
                            >

                                <div
                                    className={
                                        msg.sender === "user"
                                            ? `
                                            inline-block
                                            bg-blue-500
                                            text-white
                                            px-4
                                            py-2
                                            rounded-lg
                                            `
                                            : `
                                            inline-block
                                            bg-gray-200
                                            px-4
                                            py-2
                                            rounded-lg
                                            `
                                    }
                                >
                                    {msg.text}
                                </div>

                            </div>

                        ))}

                        {loading && (

                            <div className="text-gray-500">

                                AI Coach is typing...

                            </div>

                        )}

                    </div>

                    <div
                        className="
                        border-t
                        p-4
                        flex
                        gap-3
                        "
                    >

                        <input
                            type="text"
                            value={message}
                            placeholder="Ask fitness questions..."
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter"
                                && sendMessage()
                            }
                            className="
                            flex-1
                            border
                            rounded-lg
                            px-4
                            py-2
                            "
                        />

                        <button
                            onClick={sendMessage}
                            className="
                            bg-cyan-500
                            text-white
                            px-5
                            py-2
                            rounded-lg
                            "
                        >
                            Send
                        </button>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default AiCoach;