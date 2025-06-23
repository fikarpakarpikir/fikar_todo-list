import axios from "axios";

const api = axios.create({
	baseURL: "https//94.74.86.174:8080/api", // ganti sesuai backend
});

api.interceptors.request.use((config) => {
	const token =
		typeof window !== "undefined" ? localStorage.getItem("token") : null;
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export default api;
