export default function Waitlist() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-stone-50 to-stone-100 text-center p-4">
			<div className="relative max-w-lg w-full">
				{/* Background decorative elements */}
				<div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl"></div>
				<div className="absolute -top-4 -left-4 w-8 h-8 bg-redThread/20 rounded-full"></div>
				<div className="absolute -bottom-6 -right-6 w-12 h-12 bg-redThread/10 rounded-full"></div>
				<div className="absolute top-1/2 -right-8 w-6 h-6 bg-redThread/15 rounded-full"></div>

				{/* Main content */}
				<div className="relative p-12">
					{/* Header text */}
					<div className="mb-8">
						<p className="text-redThread/60 font-serif text-sm tracking-[0.2em] uppercase mb-4">
							Something's Coming
						</p>
						<h1 className="text-4xl md:text-5xl font-serif text-redThreadDark mb-6 leading-tight">
							You're on the
							<span className="block font-script text-5xl md:text-6xl text-redThreadDark -mt-2">
								Waitlist
							</span>
						</h1>
					</div>

					{/* Decorative divider */}
					<div className="flex items-center justify-center mb-8">
						<div className="w-12 h-px bg-redThread/30"></div>
						<div className="w-2 h-2 bg-redThread/40 rounded-full mx-4"></div>
						<div className="w-12 h-px bg-redThread/30"></div>
					</div>

					{/* Main message */}
					<div className="space-y-4 mb-8">
						<p className="text-lg font-serif text-redThread/80 leading-relaxed font-bold">
							Built for the ones who know
						</p>
						<p className="text-redThread/70 font-light text-base leading-relaxed max-w-sm mx-auto">
							We're crafting something special just for you. You'll be among the
							first to know when we're ready to welcome you in.
						</p>
					</div>

					{/* Status indicator */}
					<div className="inline-flex items-center bg-redThread/10 text-redThread px-6 py-3 rounded-full">
						<div className="w-2 h-2 bg-redThread rounded-full mr-3 animate-pulse"></div>
						<span className="font-serif text-sm tracking-wide">
							Priority Access Reserved
						</span>
					</div>

					{/* Footer note */}
					<p className="text-xs text-redThread/50 mt-8 font-light">
						We'll notify you via email when your exclusive access is ready
					</p>
				</div>
			</div>
		</div>
	);
}
