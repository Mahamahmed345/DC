import axios from "axios";

const API = axios.create({
  baseURL: "https://dc-gray.vercel.app", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;