import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
// import AuthForm from "./pages/authForm";
import Login from "./pages/login";
import SignUp from "./pages/signup";

function App() {
	const token = localStorage.getItem("token");

	return (
		<Router>
			<Routes>
				{/* <Route path="/" element={<AuthForm />} /> */}
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<SignUp />} />
			</Routes>
		</Router>
	);
}

export default App;
