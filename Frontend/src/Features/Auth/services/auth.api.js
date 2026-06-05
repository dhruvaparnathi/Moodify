import axios from 'axios';

const api = axios.create({
    baseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : '/api',
    withCredentials: true
});

export async function register({username, email, password}) {
    try {
        const response = await api.post('/auth/register', {
            username,
            email,
            password
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function verifyEmail({otp, email}) {
    try {
        const response = await api.post('/auth/verify-email', {
            otp,
            email
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function resendOtp({ email }) {
    try {
        const response = await api.post('/auth/resend-otp', { email });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function login({username, email, password}) {
    try {
        const response = await api.post('/auth/login', {
            username,
            email,
            password
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await api.get('/auth/get-me');
        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function logout() {
    try {
        const response = await api.get('/auth/logout');
        return response.data;
    } catch (err) {
        throw err;
    }
}