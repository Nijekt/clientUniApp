import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/",
  // baseURL:
  //   "https://university-app-dhf6hrgdfydjcwc5.polandcentral-01.azurewebsites.net/",
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token");
  return config;
});

export default instance;
