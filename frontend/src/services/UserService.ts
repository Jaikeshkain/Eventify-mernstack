import { API_URL } from "./EventService";
import axios from "axios";
const LoginAPI = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to login");
    }
}

const RegisterAPI = async (username: string, email: string, role: string, password: string, confirmPassword: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, { username, email, role, password, confirmPassword });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to register");
    }
}

const LogoutAPI = async () => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/logout`)
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to logout");
    }
}

//get user by id
const GetUserByIdAPI = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/api/users/${id}`)
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to get user");
    }
}
export { LoginAPI, RegisterAPI, LogoutAPI, GetUserByIdAPI };
