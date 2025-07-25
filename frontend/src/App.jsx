import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
// import AuthForm from "./pages/authForm";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Waitlist from "./pages/waitlist";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/protectedRoutes";

function App() {
	const token = localStorage.getItem("token");

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<SignUp />} />
				<Route
					path="/waitlist"
					element={
						<ProtectedRoute>
							<Waitlist />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
