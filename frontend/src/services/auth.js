import API from "../api";

export const loginUser = async (email, password) => {
    try {
        const res = await API.post("auth/login", { email, password });
        return res.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || "login failed");
    }
};

export const registerUser = async (formData) => {
    try {
        const res = await API.post("/auth/register", formData);
        return res.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || "Registration failed");
    }
};