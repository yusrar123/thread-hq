import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Waitlist from "./pages/waitlist";
import Dashboard from "./pages/dashboard";
import { getStorageItem } from "./utils/storage";

function App() {
	const token = getStorageItem("token");

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<SignUp />} />
				<Route path="/waitlist" element={<Waitlist />} />
				<Route
					path="/dashboard"
					element={token ? <Dashboard /> : <Navigate to="/login" />}
				/>
				{/* <Route path="*" element={<Navigate to="/" />} /> */}
				<Route path="*" element={<p>Path not resolved</p>} />
			</Routes>
		</Router>
	);
}

export default App;
