import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { register, login, getMe, logout, verifyEmail, resendOtp } from "../services/auth.api";

export const useAuth = ()=>{
    const context = useContext(AuthContext);

    const { user, setUser, loading, setLoading } = context;

    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true);
            await register({ username, email, password });
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyEmail = async ({ otp, email }) => {
        try {
            setLoading(true);
            const data = await verifyEmail({ otp, email });
            setUser(data.user);
            return data;
        } catch (err) {
            setUser(null);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const handleResendOtp = async ({ email }) => {
        try {
            setLoading(true);
            const data = await resendOtp({ email });
            return data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true);
            const data = await login({ email, password });
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (err) {
            setUser(null);
            if (err.response && err.response.status === 401 && err.response.data.message === "Please verify your email") {
                return { success: false, unverified: true };
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const handleGetMe = async () => {
        try {
            setLoading(true);
            const data = await getMe();
            setUser(data.user);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
            setUser(null);
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setLoading(false);
        }
    }

    return { 
        user, 
        loading, 
        handleRegister, 
        handleVerifyEmail, 
        handleResendOtp,
        handleLogin, 
        handleGetMe, 
        logout: handleLogout 
    }
}