import axios from "axios";

const api = axios.create({
  baseURL: "/", 
  // Now you can call: /products, /users/login, etc.
});

export default api;
