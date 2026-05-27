import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { register, login, getMe } from "../services/auth.api";

export const useAuth = ()=>{
    const context = useContext(AuthContext);

    const { user, setUser, loading, setLoading } = context;

    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true);
            const data = await register({ username, email, password });
            setUser(data.user);
        } catch (err) {
            setUser(null);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const handleLogin = async ({ username, email, password }) => {
        try {
            setLoading(true);
            const data = await login({ username, email, password });
            setUser(data.user);
        } catch (err) {
            setUser(null);
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

    return { user, loading, handleRegister, handleLogin, handleGetMe }
}