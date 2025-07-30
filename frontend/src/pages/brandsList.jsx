import { useNavigate } from "react-router-dom";
import { Mail, ExternalLink } from "lucide-react";
import brands from "../data/brands.json";

export default function BrandList() {
	const navigate = useNavigate();

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
					<div className="text-center mb-8">
						<h1 className="font-script text-6xl text-redThread mb-4">
							Our Brands
						</h1>
						<p className="font-serif text-gray-600 text-lg">
							Curated collections from premier fashion houses
						</p>
					</div>

					{/* Stats Cards */}
					<div className="flex justify-center">
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
							<div className="text-3xl font-serif font-bold text-redThread mb-2 text-center">
								{brands.length}
							</div>
							<div className="text-sm font-serif text-gray-500 uppercase tracking-wider">
								Premium Brands
							</div>
						</div>
					</div>
				</div>

				{/* Brands Grid */}
				{brands.length === 0 ? (
					<div className="text-center py-20">
						<div className="bg-white rounded-3xl shadow-lg p-16 border border-gray-100 max-w-md mx-auto">
							<div className="w-20 h-20 border-2 border-dashed border-redThread/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
								<span className="text-redThread/60 font-script text-2xl">
									?
								</span>
							</div>
							<h3 className="font-script text-3xl text-redThread mb-4">
								No Brands Available
							</h3>
							<p className="text-gray-500 mb-8 font-serif leading-relaxed">
								We're working on adding premium brands to our collection.
							</p>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{brands.map((brand) => (
							<div
								key={brand.id}
								onClick={() => navigate(`/brands/${brand.id}`)}
								className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
							>
								{/* Brand Logo Section */}
								<div className="aspect-square bg-gray-50 relative overflow-hidden flex items-center justify-center p-8">
									{brand.logo ? (
										<img
											src={brand.logo}
											alt={brand.name}
											className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
											onError={(e) => {
												e.target.style.display = "none";
												e.target.nextSibling.style.display = "flex";
											}}
										/>
									) : null}
									<div
										className="w-full h-full flex items-center justify-center bg-gray-100"
										style={{ display: brand.logo ? "none" : "flex" }}
									>
										<span className="text-gray-400 font-script text-2xl">
											{brand.name.charAt(0)}
										</span>
									</div>
									<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

									{/* Brand Name Overlay */}
									<div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<h3 className="text-white font-script text-xl drop-shadow-lg text-center">
											{brand.name}
										</h3>
									</div>
								</div>

								{/* Brand Details */}
								<div className="p-6">
									<div className="flex justify-between items-start mb-4">
										<div className="flex-1 min-w-0">
											<p className="text-xs text-redThread font-serif font-medium tracking-widest mb-2 uppercase">
												Premium Brand
											</p>
											<h4 className="font-serif font-bold text-gray-900 text-lg leading-tight mb-3">
												{brand.name}
											</h4>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-gray-600">
											<Mail size={16} />
											<span className="text-sm font-serif truncate">
												{brand.contactEmail || "Contact available"}
											</span>
										</div>
										<div className="text-redThread hover:text-redThreadDark transition-colors duration-200 p-2 hover:bg-gray-50 rounded-lg">
											<ExternalLink size={16} />
										</div>
									</div>

									{/* Additional Brand Info */}
									{brand.description && (
										<div className="mt-4 pt-4 border-t border-gray-100">
											<p className="text-gray-600 font-serif text-sm leading-relaxed line-clamp-2">
												{brand.description}
											</p>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
