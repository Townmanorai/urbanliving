import React, { useState } from "react";

function Auth() {
	const [username, setUsername] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

	// Signup via backend
	const handleSignup = async () => {
		try {
			console.info("[Auth] Signup attempt", { email, hasPassword: Boolean(password), username, phone });
			const response = await fetch(`${API_BASE}/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username,
					email,
					password,
					phone_number: phone || null,
				}),
			});
			const data = await response.json();
			if (!response.ok) {
				console.error("[Auth] Signup failed", data);
				alert(data?.message || "Signup failed");
				return;
			}
			console.log("User signed up:", data?.user);
			localStorage.setItem("user", JSON.stringify(data?.user));
			alert("Signup successful");
		} catch (error) {
			console.error("[Auth] Signup Error:", error);
			alert("Server error during signup");
		}
	};

	// Login via backend
	const handleLogin = async () => {
		try {
			console.info("[Auth] Login attempt", { email, hasPassword: Boolean(password) });
			const response = await fetch(`${API_BASE}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			if (!response.ok) {
				console.error("[Auth] Login failed", data);
				alert(data?.message || "Invalid credentials");
				return;
			}
			console.log("User logged in:", data?.user);
			localStorage.setItem("user", JSON.stringify(data?.user));
			alert("Login successful");
		} catch (error) {
			console.error("[Auth] Login Error:", error);
			alert("Server error during login");
		}
	};

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Signup / Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br />
      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      /><br />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />
      <button onClick={handleSignup}>Signup</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Auth;
