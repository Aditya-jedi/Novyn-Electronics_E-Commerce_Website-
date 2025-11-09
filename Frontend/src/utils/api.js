import axios from "axios";

const api = axios.create({
  baseURL: "https://novyn-electronics-e-commerce-website.onrender.com", 
});

export default api;
