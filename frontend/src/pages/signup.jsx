import { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value.trim() });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const { token, user } = await registerUser(form);
			localStorage.setItem("token in sign up", token);
			localStorage.setItem("user", JSON.stringify(user));

			console.log("Signup successful", user);

			setTimeout(() => {
				navigate("/waitlist");
			}, 300);
		} catch (err) {
			console.error("Signup error:", err);
			setError(err.message);
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

				{/* Sign Up Box */}
				<div className="bg-white shadow-lg rounded-2xl p-10 border border-redThread/10 backdrop-blur-sm w-full max-w-2xl">
					<div className="text-center mb-6">
						<h2 className="text-2xl text-redThread mb-2 font-bold">
							Create Your Account
						</h2>
						<p className="text-sm text-redThread/70">
							Join the Thread HQ community
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							name="name"
							type="text"
							placeholder="Full Name"
							value={form.name}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-redThread placeholder-redThread/50 focus:outline-none focus:ring-2 focus:ring-redThread/30"
						/>

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
									Creating...
								</div>
							) : (
								"Create Account"
							)}
						</button>

						<p className="text-sm text-center text-redThread mt-2">
							Already have an account?{" "}
							<a href="/login" className="underline hover:text-redThreadDark">
								Sign in
							</a>
						</p>
					</form>
				</div>

				{/* Footer */}
				<p className="text-center text-xs text-redThread/50 tracking-wide mt-6">
					© 2025 Thread HQ. All rights reserved.
				</p>
			</div>

			{/* Decorative Elements */}
			<div className="absolute top-10 left-10 w-20 h-20 bg-redThread/10 rounded-full blur-xl"></div>
			<div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-200/20 rounded-full blur-xl"></div>
			<div className="absolute top-1/2 left-1/4 w-16 h-16 bg-redThread/10 rounded-full blur-lg"></div>
		</div>
	);
}
