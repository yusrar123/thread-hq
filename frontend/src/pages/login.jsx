import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
export default function Login() {
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const { token, user } = await loginUser(form);

			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));
			navigate("/waitlist");
			// console.log("Login successful");
		} catch (err) {
			setError(err.message || "Login failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-cream font-serif flex items-center justify-center p-4 relative">
			<div className="w-full max-w-md">
				{/* Logo */}
				<div className="text-center mb-8">
					<img
						src="/assets/logo.png"
						alt="Thread HQ Logo"
						className="w-64 h-auto mx-auto mb-4"
					/>
				</div>

				{/* Login Box */}
				<div className="bg-white shadow-lg rounded-2xl p-10 border border-redThread/10 backdrop-blur-sm w-full max-w-lg">
					<div className="text-center mb-6">
						<h2 className="text-2xl text-redThread mb-2 font-bold">
							Welcome Back
						</h2>
						<p className="text-sm text-redThread/70">Sign in to your account</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							name="email"
							type="email"
							placeholder="Email Address"
							value={form.email}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-redThread placeholder-redThread/50 focus:outline-none focus:ring-2 focus:ring-redThread/30"
						/>

						<input
							name="password"
							type="password"
							placeholder="Password"
							value={form.password}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-redThread placeholder-redThread/50 focus:outline-none focus:ring-2 focus:ring-redThread/30"
						/>

						<label className="flex items-center gap-2 text-sm text-gray-600">
							<input type="checkbox" className="accent-redThread" />
							Remember Me
						</label>

						{error && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-3">
								<p className="text-red-700 text-sm text-center">{error}</p>
							</div>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-redThread hover:bg-redThreadDark text-white py-3 px-6 rounded-xl font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-redThread/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<div className="flex items-center justify-center">
									<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
									Signing In...
								</div>
							) : (
								"Sign In"
							)}
						</button>

						<div className="flex items-center justify-between text-sm mt-2">
							<a href="#" className="text-redThread hover:underline">
								Forgot Password?
							</a>
							<a href="/register" className="text-redThread hover:underline">
								Create Account
							</a>
						</div>
					</form>
				</div>

				{/* Footer */}
				<p className="text-center text-xs text-redThread/50 tracking-wide mt-6">
					© 2025 Thread HQ. All rights reserved.
				</p>
			</div>

			{/* Decorative Elements */}
			{/* <div className="absolute top-10 left-10 w-20 h-20 bg-redThread/10 rounded-full blur-xl"></div>
			<div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-200/20 rounded-full blur-xl"></div>
			<div className="absolute top-1/2 left-1/4 w-16 h-16 bg-redThread/10 rounded-full blur-lg"></div> */}
		</div>
	);
}
