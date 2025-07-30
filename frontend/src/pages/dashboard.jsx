import { useState, useEffect } from "react";
import { Plus, X, ExternalLink, Trash2, LogOut } from "lucide-react";
import {
	addToWishlist,
	getWishlist,
	removeFromWishlist,
} from "../services/wishlist";
import { toast } from "react-toastify";

export default function Dashboard() {
	const [wishlist, setWishlist] = useState([]);
	const [productUrl, setProductUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showAddForm, setShowAddForm] = useState(false);
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [activeFilter, setActiveFilter] = useState("ALL");

	const filters = [
		{ key: "ALL", label: "ALL" },
		{ key: "SALE", label: "SALE" },
		{ key: "AVAILABLE", label: "AVAILABLE" },
	];

	useEffect(() => {
		fetchWishlist();
	}, []);

	const fetchWishlist = async () => {
		setIsInitialLoading(true);
		try {
			const items = await getWishlist();
			setWishlist(items);
		} catch (err) {
			console.error("Fetch error:", err.message);
		} finally {
			setIsInitialLoading(false);
		}
	};

	const handleAdd = async (e) => {
		e.preventDefault();
		if (!productUrl) return;

		setIsLoading(true);
		try {
			const res = await addToWishlist(productUrl);
			setWishlist((prev) => [res.item, ...prev]);

			setProductUrl("");
			setShowAddForm(false);

			toast.success("Product added to wishlist! ", {
				icon: "✨",
			});

			setTimeout(fetchWishlist, 1000);
		} catch (err) {
			console.error("Add error:", err.message);
			toast.error("Failed to add product. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};
	const handleDelete = async (id) => {
		try {
			await removeFromWishlist(id);
			await fetchWishlist();
		} catch (err) {
			console.error("Delete error:", err.message);
		}
	};

	const handleLogout = () => {
		// Add your logout logic here
		console.log("Logout clicked");
	};

	const getDomainFromUrl = (url) => {
		try {
			const domain = new URL(url).hostname;
			return domain.replace("www.", "");
		} catch {
			return url;
		}
	};

	const getFilteredItems = () => {
		if (activeFilter === "ALL") return wishlist;
		if (activeFilter === "SALE")
			return wishlist.filter(
				(item) => item.originalPrice && item.price !== item.originalPrice
			);
		if (activeFilter === "AVAILABLE")
			return wishlist.filter((item) => item.status === "AVAILABLE");
		if (activeFilter === "WATCHING")
			return wishlist.filter((item) => item.status === "WATCHING");
		return wishlist.filter((item) => item.category === activeFilter);
	};

	const filteredItems = getFilteredItems();

	// Fixed totalSaved calculation for PKR currency
	const totalSaved = wishlist
		.filter(
			(item) =>
				item.originalPrice && item.price && item.originalPrice !== item.price
		)
		.reduce((acc, item) => {
			// Handle both PKR and Rs formats
			const originalMatch = item.originalPrice.match(/[\d,]+/);
			const currentMatch = item.price.match(/[\d,]+/);

			if (originalMatch && currentMatch) {
				const original = parseFloat(originalMatch[0].replace(/,/g, ""));
				const current = parseFloat(currentMatch[0].replace(/,/g, ""));
				return acc + (original - current);
			}
			return acc;
		}, 0);

	// const formatSavedAmount = (amount) => {
	// 	return amount > 0 ? `PKR ${amount.toLocaleString()}` : "PKR 0";
	// };

	return (
		<div className="min-h-screen bg-cream">
			{/* Header */}
			<header className="bg-redThread text-white py-2 shadow-lg relative">
				<div className="max-w-7xl mx-auto px-6">
					{/* Centered Logo */}
					<div className="text-center">
						<img
							src="/assets/logo2.png"
							alt="Thread HQ Logo"
							className="w-56 h-auto mx-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
						/>
					</div>

					{/* Logout Button - Positioned Absolutely */}
					<button
						onClick={handleLogout}
						className="absolute top-8 right-6 flex items-center gap-2 bg-redThreadDark/50 hover:bg-redThreadDark/80 px-6 py-3 rounded-lg transition-all duration-300 font-serif text-sm tracking-wide shadow-md hover:shadow-lg backdrop-blur-sm border border-white/10"
					>
						<LogOut size={18} />
						Logout
					</button>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-6 py-12">
				{/* Header Section */}
				<div className="mb-12">
					<div className="text-center mb-8">
						<h1 className="font-script text-6xl text-redThread mb-4">
							Your Wishlist
						</h1>
						<p className="font-serif text-gray-600 text-lg">
							Curated collections for the discerning eye
						</p>
					</div>

					{/* Stats Cards */}
					<div className="flex justify-center">
						{/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto text-center"> */}
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
							<div className="text-3xl font-serif font-bold text-redThread mb-2 text-center">
								{wishlist.length}
							</div>
							<div className="text-sm font-serif text-gray-500 uppercase tracking-wider">
								Items
							</div>
						</div>
					</div>
				</div>
				{/* Filter Tabs
				<div className="flex justify-center mb-12">
					<div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
						<nav className="flex space-x-2">
							{filters.map((filter) => (
								<button
									key={filter.key}
									onClick={() => setActiveFilter(filter.key)}
									className={`px-6 py-3 rounded-xl font-serif text-sm font-medium tracking-wider transition-all duration-300 ${
										activeFilter === filter.key
											? "bg-redThread text-white shadow-md"
											: "text-gray-600 hover:text-redThread hover:bg-gray-50"
									}`}
								>
									{filter.label}
								</button>
							))}
						</nav>
					</div>
				</div> */}
				{/* Add Product Form */}
				{showAddForm && (
					<div className="mb-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-2xl mx-auto">
						<div className="flex justify-between items-center mb-6">
							<h3 className="font-serif text-xl font-medium text-gray-900">
								Add New Product
							</h3>
							<button
								onClick={() => setShowAddForm(false)}
								className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-50 rounded-lg"
							>
								<X size={20} />
							</button>
						</div>
						<div className="flex gap-4">
							<input
								type="url"
								value={productUrl}
								onChange={(e) => setProductUrl(e.target.value)}
								placeholder="Paste product link here..."
								className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-redThread/20 focus:border-redThread font-serif transition-all duration-200"
								disabled={isLoading}
							/>
							<button
								onClick={handleAdd}
								disabled={isLoading || !productUrl.trim()}
								className="bg-redThread text-white px-8 py-4 rounded-xl hover:bg-redThreadDark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-serif font-medium shadow-md hover:shadow-lg"
							>
								{isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										Adding...
									</>
								) : (
									<>
										<Plus size={18} />
										Add Product
									</>
								)}
							</button>
						</div>
					</div>
				)}
				{/* Product Grid */}
				{isInitialLoading ? (
					<div className="text-center py-20">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-redThread mx-auto"></div>
						<p className="text-gray-500 mt-6 font-serif">
							Loading your wishlist...
						</p>
					</div>
				) : filteredItems.length === 0 ? (
					<div className="text-center py-20">
						<div className="bg-white rounded-3xl shadow-lg p-16 border border-gray-100 max-w-md mx-auto">
							<div
								onClick={() => setShowAddForm(true)}
								className="w-20 h-20 border-2 border-dashed border-redThread/30 rounded-2xl flex items-center justify-center mx-auto mb-8 cursor-pointer hover:border-redThread transition-colors duration-300 hover:bg-redThread/5"
							>
								<Plus size={28} className="text-redThread/60" />
							</div>
							<h3 className="font-script text-3xl text-redThread mb-4">
								Start Your Collection
							</h3>
							<p className="text-gray-500 mb-8 font-serif leading-relaxed">
								{activeFilter === "ALL"
									? "Your wishlist awaits. Begin by adding your first treasured find."
									: `No items found in ${activeFilter.toLowerCase()} category.`}
							</p>
							<button
								onClick={() => setShowAddForm(true)}
								className="bg-redThread text-white px-8 py-4 rounded-xl hover:bg-redThreadDark transition-all duration-300 font-serif font-medium shadow-md hover:shadow-lg"
							>
								Add Your First Product
							</button>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{/* Add New Item Card */}
						<div
							onClick={() => setShowAddForm(true)}
							className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300 h-96 hover:border-redThread/20 group"
						>
							<div className="w-16 h-16 border-2 border-dashed border-redThread/30 rounded-2xl flex items-center justify-center mb-6 group-hover:border-redThread group-hover:bg-redThread/5 transition-all duration-300">
								<Plus
									size={24}
									className="text-redThread/60 group-hover:text-redThread"
								/>
							</div>
							<h3 className="font-script text-2xl text-redThread">
								Add New Item
							</h3>
						</div>

						{/* Product Cards */}
						{filteredItems.map((item) => (
							<div
								key={item._id}
								className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
							>
								{/* Status Indicator */}
								<div className="relative">
									<div
										className={`absolute top-4 right-4 w-3 h-3 rounded-full z-10 shadow-md ${
											item.originalPrice && item.price !== item.originalPrice
												? "bg-red-500"
												: item.status === "WATCHING"
												? "bg-yellow-500"
												: "bg-green-500"
										}`}
									></div>

									{/* Product Image */}
									<div className="aspect-square bg-gray-50 relative overflow-hidden">
										{item.image ? (
											<img
												src={item.image}
												alt={item.title}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												onError={(e) => {
													e.target.style.display = "none";
												}}
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center bg-gray-100">
												<span className="text-gray-400 font-serif">
													No Image
												</span>
											</div>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

										{/* Product Title Overlay */}
										<div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											<h3 className="text-white font-serif font-medium text-lg drop-shadow-lg line-clamp-2">
												{item.title || "PRODUCT"}
											</h3>
										</div>
									</div>
								</div>

								{/* Product Details */}
								<div className="p-6">
									<div className="flex justify-between items-start mb-4">
										<div className="flex-1 min-w-0">
											<p className="text-xs text-redThread font-serif font-medium tracking-widest mb-2 uppercase">
												{getDomainFromUrl(item.productUrl) || "STORE"}
											</p>
											<h4 className="font-serif font-medium text-gray-900 text-sm leading-tight line-clamp-2 mb-3">
												{item.title}
											</h4>
										</div>
										<button
											onClick={() => handleDelete(item._id)}
											className="text-gray-300 hover:text-red-500 transition-colors duration-200 ml-3 flex-shrink-0 p-2 hover:bg-gray-50 rounded-lg"
										>
											<Trash2 size={16} />
										</button>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="text-lg font-serif font-bold text-gray-900">
												{item.price}
											</span>
											{item.originalPrice &&
												item.originalPrice !== item.price && (
													<span className="text-sm text-gray-400 line-through font-serif">
														{item.originalPrice}
													</span>
												)}
										</div>
										<a
											href={item.productUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-redThread hover:text-redThreadDark transition-colors duration-200 p-2 hover:bg-gray-50 rounded-lg"
										>
											<ExternalLink size={16} />
										</a>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Floating Add Button */}
			<button
				onClick={() => setShowAddForm(true)}
				className="fixed bottom-8 right-8 bg-redThread text-white rounded-2xl p-4 shadow-xl hover:bg-redThreadDark hover:shadow-2xl transition-all duration-300 z-50 hover:scale-105"
			>
				<Plus size={24} />
			</button>
		</div>
	);
}
