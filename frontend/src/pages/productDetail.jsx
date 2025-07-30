import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Star, ArrowLeft, Plus, Minus } from "lucide-react";

export default function ProductDetail() {
	const { brandId, productId } = useParams();
	const navigate = useNavigate();

	const [product, setProduct] = useState(null);
	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedSize, setSelectedSize] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadProduct = async () => {
			setLoading(true);
			try {
				// Dynamically import the correct brand's product list
				const productData = await import(`../data/products/${brandId}.json`);
				const found = productData.default.find((p) => p.id === productId);

				if (found) {
					setProduct(found);
					setSelectedSize(found.sizes?.[0] || null);
				} else {
					setProduct(null);
				}
			} catch (err) {
				console.error("Error loading product:", err);
				setProduct(null);
			} finally {
				setLoading(false);
			}
		};

		loadProduct();
	}, [brandId, productId]);

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
					<p className="text-gray-500 mt-6 font-serif">
						Loading product details...
					</p>
				</div>
			</div>
		);
	}

	if (!product) {
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

				<div className="flex items-center justify-center py-20">
					<div className="bg-white rounded-3xl shadow-lg p-16 border border-gray-100 max-w-md mx-auto text-center">
						<h3 className="font-script text-3xl text-redThread mb-4">
							Product Not Found
						</h3>
						<p className="text-gray-500 mb-8 font-serif leading-relaxed">
							The product you're looking for doesn't exist in brand "{brandId}".
						</p>
						<button
							onClick={() => navigate(`/brands/${brandId}`)}
							className="bg-redThread text-white px-8 py-4 rounded-xl hover:bg-redThreadDark transition-all duration-300 font-serif font-medium shadow-md hover:shadow-lg"
						>
							Back to Brand
						</button>
					</div>
				</div>
			</div>
		);
	}

	const productImages = product.images || [product.image];

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
				{/* Back Button */}
				<button
					onClick={() => navigate(`/brands/${brandId}`)}
					className="mb-8 flex items-center gap-3 text-redThread hover:text-redThreadDark transition-all duration-300 font-serif text-lg bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md"
				>
					<ArrowLeft size={20} />
					Back to Collection
				</button>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
					{/* Product Images */}
					<div className="space-y-6">
						{/* Main Image */}
						<div className="aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100 group">
							<img
								src={productImages[selectedImage]}
								alt={product.name}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								onError={(e) => {
									e.target.src = "https://via.placeholder.com/400x500";
								}}
							/>
						</div>

						{/* Thumbnail Images */}
						{productImages.length > 1 && (
							<div className="grid grid-cols-4 gap-3">
								{productImages.map((image, index) => (
									<button
										key={index}
										onClick={() => setSelectedImage(index)}
										className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-md ${
											selectedImage === index
												? "border-redThread shadow-md"
												: "border-gray-200 hover:border-redThread/50"
										}`}
									>
										<img
											src={image}
											alt={`${product.name} ${index + 1}`}
											className="w-full h-full object-cover"
											onError={(e) => {
												e.target.src = "https://via.placeholder.com/100x100";
											}}
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Product Details */}
					<div className="space-y-8">
						{/* Product Header */}
						<div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
							<h1 className="font-script text-5xl text-redThread mb-6">
								{product.name}
							</h1>

							<div className="flex items-center gap-4 mb-6">
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											size={18}
											className={`${
												i < Math.floor(product.rating || 4.5)
													? "text-yellow-400 fill-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
									<span className="ml-2 text-gray-600 font-serif">
										{product.rating || "4.5"} ({product.reviews || "24"}{" "}
										reviews)
									</span>
								</div>
								<div
									className={`px-4 py-2 rounded-full text-sm font-serif font-medium ${
										product.available !== false
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									{product.available !== false ? "In Stock" : "Out of Stock"}
								</div>
							</div>

							<div className="flex items-center gap-4 mb-6">
								<span className="text-4xl font-serif font-bold text-gray-900">
									{product.price}
								</span>
								{product.originalPrice &&
									product.originalPrice !== product.price && (
										<span className="text-xl text-gray-400 line-through font-serif">
											{product.originalPrice}
										</span>
									)}
							</div>

							{product.description && (
								<p className="text-gray-600 font-serif leading-relaxed text-lg">
									{product.description}
								</p>
							)}
						</div>

						{/* Size Selection */}
						{product.sizes && product.sizes.length > 0 && (
							<div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
								<h3 className="font-serif text-xl font-medium mb-6">
									Size: {selectedSize || "Select Size"}
								</h3>
								<div className="flex flex-wrap gap-3">
									{product.sizes.map((size) => (
										<button
											key={size}
											onClick={() => setSelectedSize(size)}
											className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 font-serif font-medium ${
												selectedSize === size
													? "border-redThread bg-redThread text-white shadow-md"
													: "border-gray-200 hover:border-redThread hover:shadow-sm"
											}`}
										>
											{size}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Quantity */}
						<div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
							<h3 className="font-serif text-xl font-medium mb-6">Quantity</h3>
							<div className="flex items-center gap-4">
								<button
									onClick={() => setQuantity(Math.max(1, quantity - 1))}
									className="w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-redThread transition-all duration-300 flex items-center justify-center hover:shadow-sm group"
								>
									<Minus
										size={18}
										className="text-gray-600 group-hover:text-redThread"
									/>
								</button>
								<span className="font-serif text-xl font-medium w-12 text-center bg-gray-50 rounded-xl py-3">
									{quantity}
								</span>
								<button
									onClick={() => setQuantity(quantity + 1)}
									className="w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-redThread transition-all duration-300 flex items-center justify-center hover:shadow-sm group"
								>
									<Plus
										size={18}
										className="text-gray-600 group-hover:text-redThread"
									/>
								</button>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="space-y-4">
							<button
								className={`w-full py-4 rounded-xl transition-all duration-300 font-serif font-medium text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg ${
									product.available !== false
										? "bg-redThread text-white hover:bg-redThreadDark"
										: "bg-gray-300 text-gray-500 cursor-not-allowed"
								}`}
								disabled={product.available === false}
							>
								<ShoppingBag size={22} />
								{product.available !== false ? "Add to Cart" : "Out of Stock"}
							</button>
							<button className="w-full border-2 border-redThread text-redThread py-4 rounded-xl hover:bg-redThread hover:text-white transition-all duration-300 font-serif font-medium text-lg flex items-center justify-center gap-3 shadow-sm hover:shadow-md">
								<Heart size={22} />
								Add to Wishlist
							</button>
						</div>

						{/* Product Details */}
						<div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
							<h3 className="font-serif text-xl font-medium mb-6">
								Product Details
							</h3>
							<div className="space-y-4 text-gray-600 font-serif">
								<div className="flex justify-between py-2 border-b border-gray-100">
									<span className="font-medium">Category:</span>
									<span>{product.category || "Fashion"}</span>
								</div>
								<div className="flex justify-between py-2 border-b border-gray-100">
									<span className="font-medium">Product ID:</span>
									<span>{product.id}</span>
								</div>
								{product.sizes && product.sizes.length > 0 && (
									<div className="flex justify-between py-2 border-b border-gray-100">
										<span className="font-medium">Available Sizes:</span>
										<span>{product.sizes.join(", ")}</span>
									</div>
								)}
								<div className="flex justify-between py-2">
									<span className="font-medium">Availability:</span>
									<span
										className={`font-medium ${
											product.available !== false
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{product.available !== false ? "In Stock" : "Out of Stock"}
									</span>
								</div>
							</div>
						</div>

						{/* Care Instructions */}
						<div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
							<h3 className="font-serif text-xl font-medium mb-6">
								Care Instructions
							</h3>
							<ul className="text-gray-600 font-serif space-y-3">
								<li className="flex items-start gap-3">
									<span className="text-redThread">•</span>
									<span>Dry clean only for best results</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-redThread">•</span>
									<span>Store in a cool, dry place</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-redThread">•</span>
									<span>Avoid direct sunlight when storing</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-redThread">•</span>
									<span>Handle with care to maintain quality</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
