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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BrandShowcase from "./pages/brandPage";
import ProductDetail from "./pages/productDetail";
import BrandList from "./pages/brandsList";
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
				<Route path="/brands" element={<BrandList />} />
				<Route path="/brands/:brandId" element={<BrandShowcase />} />
				<Route path="/brands/:brandId/:productId" element={<ProductDetail />} />
			</Routes>

			<ToastContainer position="top-center" autoClose={3000} />
		</Router>
	);
}

export default App;
