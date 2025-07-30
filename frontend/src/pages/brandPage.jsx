import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import brandsData from "../data/brands.json";

export default function BrandProducts() {
	const { brandId } = useParams();
	const navigate = useNavigate();

	const [brand, setBrand] = useState(null);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const foundBrand = brandsData.find((b) => b.id === brandId);
		setBrand(foundBrand);

		const loadProducts = async () => {
			try {
				const productModule = await import(
					`../data/products/${brandId}.json`,
					{}
				);
				setProducts(productModule.default || []);
			} catch (error) {
				console.error("Failed to load products:", error);
				setProducts([]);
			}
			setLoading(false);
		};

		loadProducts();
	}, [brandId]);

	if (!brand) {
		return (
			<div className="min-h-screen bg-cream flex items-center justify-center">
				<div className="bg-white rounded-3xl shadow-lg p-16 border border-gray-100 max-w-md mx-auto text-center">
					<h3 className="font-script text-3xl text-redThread mb-4">
						Brand Not Found
					</h3>
					<p className="text-gray-500 mb-8 font-serif leading-relaxed">
						The brand you're looking for doesn't exist.
					</p>
					<button
						onClick={() => navigate("/brands")}
						className="bg-redThread text-white px-8 py-4 rounded-xl hover:bg-redThreadDark transition-all duration-300 font-serif font-medium shadow-md hover:shadow-lg"
					>
						Back to Brands
					</button>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-cream">
				{/* Header */}
				<header className="bg-redThread text-white py-2 shadow-lg">
					<div className="max-w-7xl mx-auto px-6">
						<div className="text-center">
							<img
								src="/assets/logo2.png"
								alt="Thread HQ Logo"
								className="w-56 h-auto mx-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
							/>
						</div>
					</div>
				</header>

				<div className="text-center py-20">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-redThread mx-auto"></div>
					<p className="text-gray-500 mt-6 font-serif">Loading products...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-cream">
			{/* Header */}
			<header className="bg-redThread text-white py-2 shadow-lg">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center">
						<img
							src="/assets/logo2.png"
							alt="Thread HQ Logo"
							className="w-56 h-auto mx-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
						/>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-6 py-12">
				{/* Header Section */}
				<div className="mb-12">
					{/* Back Button */}
					<button
						onClick={() => navigate("/brands")}
						className="mb-8 flex items-center gap-3 text-redThread hover:text-redThreadDark transition-all duration-300 font-serif text-lg bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md"
					>
						<ArrowLeft size={20} />
						Back to Collection
					</button>

					<div className="text-center mb-8">
						<h1 className="font-script text-6xl text-redThread mb-4">
							{brand.name} Products
						</h1>
						<p className="font-serif text-gray-600 text-lg">
							Curated collections for the discerning eye
						</p>
					</div>

					{/* Stats Cards */}
					<div className="flex justify-center">
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
							<div className="text-3xl font-serif font-bold text-redThread mb-2 text-center">
								{products.length}
							</div>
							<div className="text-sm font-serif text-gray-500 uppercase tracking-wider">
								Products
							</div>
						</div>
					</div>
				</div>

				{/* Products Grid */}
				{products.length === 0 ? (
					<div className="text-center py-20">
						<div className="bg-white rounded-3xl shadow-lg p-16 border border-gray-100 max-w-md mx-auto">
							<div className="w-20 h-20 border-2 border-dashed border-redThread/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
								<span className="text-redThread/60 font-script text-2xl">
									?
								</span>
							</div>
							<h3 className="font-script text-3xl text-redThread mb-4">
								No Products Available
							</h3>
							<p className="text-gray-500 mb-8 font-serif leading-relaxed">
								This brand doesn't have any products available at the moment.
							</p>
							<button
								onClick={() => navigate("/brands")}
								className="bg-redThread text-white px-8 py-4 rounded-xl hover:bg-redThreadDark transition-all duration-300 font-serif font-medium shadow-md hover:shadow-lg"
							>
								Explore Other Brands
							</button>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{products.map((product) => (
							<div
								key={product.id}
								onClick={() => navigate(`/brands/${brandId}/${product.id}`)}
								className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
							>
								{/* Product Image */}
								<div className="aspect-square bg-gray-50 relative overflow-hidden">
									<img
										src={product.image || "https://via.placeholder.com/300x400"}
										alt={product.name}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										onError={(e) => {
											e.target.src = "https://via.placeholder.com/300x400";
										}}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

									{/* Product Title Overlay */}
									<div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<h3 className="text-white font-serif font-medium text-lg drop-shadow-lg line-clamp-2">
											{product.name}
										</h3>
									</div>
								</div>

								{/* Product Details */}
								<div className="p-6">
									<div className="flex justify-between items-start mb-4">
										<div className="flex-1 min-w-0">
											<p className="text-xs text-redThread font-serif font-medium tracking-widest mb-2 uppercase">
												{brand.name}
											</p>
											<h4 className="font-serif font-medium text-gray-900 text-sm leading-tight line-clamp-2 mb-3">
												{product.name}
											</h4>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="text-lg font-serif font-bold text-gray-900">
												{product.price}
											</span>
											{product.originalPrice &&
												product.originalPrice !== product.price && (
													<span className="text-sm text-gray-400 line-through font-serif">
														{product.originalPrice}
													</span>
												)}
										</div>
										<div className="text-redThread hover:text-redThreadDark transition-colors duration-200 p-2 hover:bg-gray-50 rounded-lg">
											<ExternalLink size={16} />
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
