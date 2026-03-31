import axios from "axios";

const baseURL = process.env.REACT_APP_BASEURL || "http://localhost:5000/api/v1";

const API = axios.create({ baseURL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")} `;
  }
  return req;
});

export default API;
