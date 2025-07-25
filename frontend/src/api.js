

import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Attach token automatically to every request
API.interceptors.request.use((req) => {
    try {
        const token = localStorage.getItem("token");
        // console.log("Token found:", token ? "Yes" : "No");
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error("Error accessing localStorage:", error);
    }
    return req;
});



export default API;