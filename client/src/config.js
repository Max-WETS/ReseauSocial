import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://maxweb21.herokuapp.com/api",
  withCredentials: true,
});
