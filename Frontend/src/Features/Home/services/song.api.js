import axios from 'axios';

const api = axios.create({
    baseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : '/api',
    withCredentials: true
});

export async function getSongsByMood(mood) {
    try {
        // Map frontend "surprized" key to database "surprised" key
        const normalizedMood = mood === 'surprized' ? 'surprised' : mood;
        const response = await api.get(`/song/mood/${normalizedMood}`);
        return response.data.songs || [];
    } catch (err) {
        console.error("Error fetching mood songs:", err);
        return [];
    }
}
