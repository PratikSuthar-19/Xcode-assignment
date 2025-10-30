import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const signup = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/signup`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data; 
  } catch (err: any) {
    console.error("Signup Error:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};


export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });

    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return res.data; // { token, user }
  } catch (err: any) {
    console.error("Login Error:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};
