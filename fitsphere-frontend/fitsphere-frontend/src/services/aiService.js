import api from "./api";

export const askAI = async (message) => {

    const token = localStorage.getItem("token");

    const response = await api.post(
        "/ai/chat",
        {
            message
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data.response;
};
export default askAI;