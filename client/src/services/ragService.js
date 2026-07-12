import axios from "axios";

const API = "http://localhost:5000/api/rag";

export const uploadPDF = async (file) => {
    const formData = new FormData();
    formData.append("pdf", file);

    return axios.post(`${API}/upload`, formData);
};

export const askPDF = async ({
    question,
    chatId,
    pdfName,
    userId,
}) => {

    return axios.post(`${API}/ask`, {
        question,
        chatId,
        pdfName,
        userId,
    });

};