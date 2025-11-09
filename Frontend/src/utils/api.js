import axios from "axios";

const api = axios.create({
  baseURL: "/api",   // IMPORTANT: frontend will be served by backend, so use a relative path
});

export default api;
