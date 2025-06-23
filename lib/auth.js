import api from "./api";

export async function login(username, password) {
	try {
		const response = await api.post("/login", { username, password });

		const token = response.data.token;
		localStorage.setItem("token", token);

		// Optional: return user info if available
		return { success: true, token };
	} catch (error) {
		console.error("Login failed:", error.response?.data || error.message);
		return {
			success: false,
			error: error.response?.data?.message || "Login gagal",
		};
	}
}

export async function register(username, email, password) {
	try {
		const response = await api.post("/register", {
			username,
			email,
			password,
		});

		return { success: true, data: response.data };
	} catch (error) {
		console.error("Register failed:", error.response?.data || error.message);
		return {
			success: false,
			error: error.response?.data?.message || "Registrasi gagal",
		};
	}
}
