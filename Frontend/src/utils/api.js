import axios from "axios";

const api = axios.create({
  baseURL: "https://novyn-electronics-e-commerce-website.onrender.com/api",   // IMPORTANT: frontend will be served by backend, so use a relative path
});

export default api;
