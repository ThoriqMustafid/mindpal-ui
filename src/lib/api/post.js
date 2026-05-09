import api from '../api.js';

function unwrap(response) {
    return response.data.data ?? response.data;
}

export async function getPosts(category = 'semua') {
    const params = {};

    if (category === 'trending') {
        params.trending = true;
    } else if (category && category !== 'semua') {
        params.category_id = category;
    }

    const response = await api.get('/api/posts', { params });

    return unwrap(response);
}

export async function createPost(data) {
    const response = await api.post('/api/posts', data);

    return unwrap(response);
}

export async function toggleLike(postId) {
    const response = await api.post(`/api/posts/${postId}/toggle-like`);

    return response.data;
}

export async function addComment(postId, content) {
    const response = await api.post(`/api/posts/${postId}/comments`, { content });

    return unwrap(response);
}

export default {
    getPosts,
    createPost,
    toggleLike,
    addComment
};
