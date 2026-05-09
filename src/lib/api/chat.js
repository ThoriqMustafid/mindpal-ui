import api from '../api.js';

function unwrap(response) {
    return response.data.data ?? response.data;
}

export async function getCounselors() {
    const response = await api.get('/api/chats');

    return unwrap(response);
}

export async function getMessages(chatId) {
    const response = await api.get(`/api/chats/${chatId}/messages`);

    return unwrap(response);
}

export async function sendMessage(chatId, content) {
    const response = await api.post(`/api/chats/${chatId}/messages`, { content });

    return unwrap(response);
}

export default {
    getCounselors,
    getMessages,
    sendMessage
};
