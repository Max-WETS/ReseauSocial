import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://maxwebs.herokuapp.com/api",
});
