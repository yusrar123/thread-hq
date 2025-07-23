import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Waitlist from "./pages/waitlist";
import Dashboard from "./pages/dashboard";

function App() {
	const [token, setToken] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		console.log("App mounted, checking for token...");
		try {
			const storedToken = localStorage.getItem("token");
			console.log("Token found:", storedToken);
			setToken(storedToken);
		} catch (error) {
			console.error("Error accessing localStorage:", error);
		}
		setIsLoading(false);
		console.log("Loading complete");
	}, []);

	console.log("App rendering, isLoading:", isLoading, "token:", token);

	if (isLoading) {
		return <div style={{ padding: "20px", fontSize: "18px" }}>Loading...</div>;
	}

	return (
		<Router>
			<div>
				<h1>App is working!</h1>
				<p>Current path: {window.location.pathname}</p>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<SignUp />} />
					<Route path="/waitlist" element={<Waitlist />} />
					<Route
						path="/dashboard"
						element={token ? <Dashboard /> : <Navigate to="/login" />}
					/>
					<Route
						path="*"
						element={
							<div>
								404 - Page not found. Current path: {window.location.pathname}
							</div>
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
