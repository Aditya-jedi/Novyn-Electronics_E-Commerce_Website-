import axios from "axios";

const api = axios.create({
  baseURL: "https://novyn-electronics-e-commerce-website.onrender.com", 
  // Now you can call: /products, /users/login, etc.
});

export default api;
