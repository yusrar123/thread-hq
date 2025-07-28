import { useState, useEffect } from "react";
import { Plus, X, ExternalLink, Trash2, LogOut } from "lucide-react";
import {
	addToWishlist,
	getWishlist,
	removeFromWishlist,
} from "../services/wishlist";

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

			// Optimistically prepend new item
			setWishlist((prev) => [res.item, ...prev]);

			setProductUrl("");
			setShowAddForm(false);
			alert("Product added to wishlist successfully!");

			// Optional: refresh from backend after 1 second
			setTimeout(fetchWishlist, 1000);
		} catch (err) {
			console.error("Add error:", err.message);
			alert("Failed to add product. Please try again.");
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

	const formatSavedAmount = (amount) => {
		return amount > 0 ? `PKR ${amount.toLocaleString()}` : "PKR 0";
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-red-800 text-white py-8 shadow-sm">
				<div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
					<div className="text-center flex-1">
						<h1 className="text-5xl font-light tracking-[0.2em] mb-2">
							THREAD
						</h1>
						<p className="text-red-200 text-sm tracking-[0.3em] font-light">
							EST. 2025
						</p>
					</div>
					<button
						onClick={handleLogout}
						className="flex items-center gap-2 bg-red-900 hover:bg-red-950 px-4 py-2 rounded-md transition duration-200"
					>
						<LogOut size={16} />
						Logout
					</button>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-6 py-8">
				{/* Header Section */}
				<div className="flex justify-between items-start mb-8">
					<div>
						<h2 className="text-4xl font-light text-gray-800 mb-2">
							Your Wishlist
						</h2>
					</div>
					<div className="flex gap-8 text-right">
						<div>
							<div className="text-3xl font-light text-gray-900">
								{wishlist.length}
							</div>
							<div className="text-sm text-gray-500 font-light">Items</div>
						</div>
						<div>
							<div className="text-3xl font-light text-gray-900">
								{
									wishlist.filter(
										(item) =>
											item.originalPrice && item.price !== item.originalPrice
									).length
								}
							</div>
							<div className="text-sm text-gray-500 font-light">On Sale</div>
						</div>
						<div>
							<div className="text-3xl font-light text-gray-900">
								{formatSavedAmount(totalSaved)}
							</div>
							<div className="text-sm text-gray-500 font-light">Saved</div>
						</div>
					</div>
				</div>

				{/* Filter Tabs */}
				<div className="border-b border-gray-200 mb-8">
					<nav className="flex space-x-8">
						{filters.map((filter) => (
							<button
								key={filter.key}
								onClick={() => setActiveFilter(filter.key)}
								className={`py-4 px-1 border-b-2 font-medium text-sm tracking-wider transition-colors duration-200 ${
									activeFilter === filter.key
										? "border-red-800 text-red-800"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
							>
								{filter.label}
							</button>
						))}
					</nav>
				</div>

				{/* Add Product Form */}
				{showAddForm && (
					<div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-medium text-gray-900">
								Add New Product
							</h3>
							<button
								onClick={() => setShowAddForm(false)}
								className="text-gray-400 hover:text-gray-600 transition duration-200"
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
								className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
								disabled={isLoading}
							/>
							<button
								onClick={handleAdd}
								disabled={isLoading || !productUrl.trim()}
								className="bg-red-800 text-white px-6 py-3 rounded-md hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center gap-2"
							>
								{isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										Adding...
									</>
								) : (
									<>
										<Plus size={16} />
										Add Product
									</>
								)}
							</button>
						</div>
					</div>
				)}

				{/* Product Grid */}
				{isInitialLoading ? (
					<div className="text-center py-16">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
						<p className="text-gray-500 mt-4">Loading your wishlist...</p>
					</div>
				) : filteredItems.length === 0 ? (
					<div className="text-center py-16">
						<div className="bg-white rounded-lg shadow-sm p-16 border border-gray-200">
							<div
								onClick={() => setShowAddForm(true)}
								className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-6 cursor-pointer hover:border-red-400 transition-colors duration-200"
							>
								<Plus size={32} className="text-gray-400" />
							</div>
							<h3 className="text-xl font-light text-gray-900 mb-2 tracking-wide">
								ADD NEW ITEM
							</h3>
							<p className="text-gray-500 mb-6 font-light">
								{activeFilter === "ALL"
									? "Your wishlist is empty. Start by adding your first product link."
									: `No items found in ${activeFilter.toLowerCase()} category.`}
							</p>
							<button
								onClick={() => setShowAddForm(true)}
								className="bg-red-800 text-white px-6 py-3 rounded-md hover:bg-red-900 transition duration-200 font-light tracking-wide"
							>
								Add Your First Product
							</button>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{/* Add New Item Card */}
						<div
							onClick={() => setShowAddForm(true)}
							className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow duration-200 h-80"
						>
							<div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
								<Plus size={24} className="text-gray-400" />
							</div>
							<h3 className="text-lg font-light text-gray-900 tracking-wide">
								ADD NEW ITEM
							</h3>
						</div>

						{/* Product Cards */}
						{filteredItems.map((item) => (
							<div
								key={item._id}
								className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
							>
								{/* Status Indicator */}
								<div className="relative">
									<div
										className={`absolute top-4 right-4 w-3 h-3 rounded-full z-10 ${
											item.originalPrice && item.price !== item.originalPrice
												? "bg-red-500"
												: item.status === "WATCHING"
												? "bg-yellow-500"
												: "bg-green-500"
										}`}
									></div>

									{/* Product Image */}
									<div className="aspect-square bg-gray-100 relative overflow-hidden">
										{item.image ? (
											<img
												src={item.image}
												alt={item.title}
												className="w-full h-full object-cover"
												onError={(e) => {
													e.target.style.display = "none";
												}}
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center bg-gray-200">
												<span className="text-gray-400">No Image</span>
											</div>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

										{/* Product Title Overlay */}
										<div className="absolute bottom-4 left-4 right-4">
											<h3 className="text-white font-medium text-lg tracking-wide drop-shadow-lg line-clamp-2">
												{item.title?.toUpperCase() || "PRODUCT"}
											</h3>
										</div>
									</div>
								</div>

								{/* Product Details */}
								<div className="p-6">
									<div className="flex justify-between items-start mb-3">
										<div className="flex-1 min-w-0">
											<p className="text-xs text-gray-500 font-medium tracking-wider mb-1">
												{getDomainFromUrl(item.productUrl)?.toUpperCase() ||
													"STORE"}
											</p>
											<h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
												{item.title}
											</h4>
										</div>
										<button
											onClick={() => handleDelete(item._id)}
											className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-2 flex-shrink-0"
										>
											<Trash2 size={16} />
										</button>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="text-lg font-medium text-gray-900">
												{item.price}
											</span>
											{item.originalPrice &&
												item.originalPrice !== item.price && (
													<span className="text-sm text-gray-500 line-through">
														{item.originalPrice}
													</span>
												)}
										</div>
										<a
											href={item.productUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-red-800 hover:text-red-900 transition-colors duration-200"
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
				className="fixed bottom-8 right-8 bg-red-800 text-white rounded-full p-4 shadow-lg hover:bg-red-900 hover:shadow-xl transition-all duration-200 z-50"
			>
				<Plus size={24} />
			</button>
		</div>
	);
}
