import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

// Simple test components first
const TestLogin = () => (
	<div style={{ padding: "20px", textAlign: "center" }}>
		<h1>Login Page Working!</h1>
		<p>You are on the login page</p>
		<p>Current URL: {window.location.href}</p>
	</div>
);

const TestSignUp = () => (
	<div style={{ padding: "20px", textAlign: "center" }}>
		<h1>Sign Up Page Working!</h1>
		<p>You are on the signup page</p>
	</div>
);

const TestWaitlist = () => (
	<div style={{ padding: "20px", textAlign: "center" }}>
		<h1>Waitlist Page Working!</h1>
		<p>You are on the waitlist page</p>
	</div>
);

const TestDashboard = () => (
	<div style={{ padding: "20px", textAlign: "center" }}>
		<h1>Dashboard Page Working!</h1>
		<p>You are on the dashboard page</p>
	</div>
);

function App() {
	console.log("App component rendering...");

	// Simple token check (without localStorage issues)
	const [token, setToken] = React.useState(null);
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		console.log("App mounted, checking token...");
		try {
			if (typeof window !== "undefined") {
				const storedToken = localStorage.getItem("token");
				setToken(storedToken);
			}
		} catch (error) {
			console.error("localStorage error:", error);
		}
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div style={{ padding: "20px", textAlign: "center" }}>
				<h2>Loading...</h2>
			</div>
		);
	}

	console.log("Rendering routes...");

	return (
		<div className="app">
			<Router>
				<div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
					<header
						style={{ padding: "10px", backgroundColor: "#333", color: "white" }}
					>
						<h3>Thread App - Router Test</h3>
					</header>

					<Routes>
						<Route path="/" element={<TestLogin />} />
						<Route path="/login" element={<TestLogin />} />
						<Route path="/register" element={<TestSignUp />} />
						<Route path="/waitlist" element={<TestWaitlist />} />
						<Route
							path="/dashboard"
							element={
								token ? <TestDashboard /> : <Navigate to="/login" replace />
							}
						/>
						<Route
							path="*"
							element={
								<div style={{ padding: "20px", textAlign: "center" }}>
									<h2>404 - Page Not Found</h2>
									<p>Current path: {window.location.pathname}</p>
									<a href="/">Go to Home</a>
								</div>
							}
						/>
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
