import WishlistItem from "../models/wishlistItem.js";
import { scrapeProductInfo } from "./scraper.js";

// 1. Add a new wishlist item

// import { scrapeProductInfo } from "../utils/scrapeProduct.js";

export const addToWishlist = async (req, res) => {
    try {
        const { productUrl } = req.body;

        if (!productUrl) {
            return res.status(400).json({ error: "Product URL is required" });
        }

        const scrapedData = await scrapeProductInfo(productUrl);

        const newItem = new WishlistItem({
            userId: req.user,
            productUrl,
            title: scrapedData.title || null,
            image: scrapedData.image || null,
            price: scrapedData.price || null,
            status: scrapedData.title === "Unavailable" ? "unavailable" : "fetched",
        });
        console.log("New wishlist item data:", newItem);

        await newItem.save();

        res.status(201).json({ message: "Item added", item: newItem });
    } catch (err) {
        console.error("Add to wishlist error:", err);
        res.status(500).json({ error: "Server error while adding item" });
    }
};


// 2. Get wishlist items for the logged-in user
export const getWishlist = async (req, res) => {
    try {
        const items = await WishlistItem.find({ userId: req.user }).sort({ createdAt: -1 });

        res.json(items);
    } catch (err) {
        console.error("Error fetching wishlist:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// 3. Remove an item from the wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await WishlistItem.findOneAndDelete({
            _id: id,
            userId: req.user,
        });

        if (!item) {
            return res.status(404).json({ error: "Item not found or unauthorized" });
        }

        res.json({ message: "Item removed", item });
    } catch (err) {
        console.error("Error removing wishlist item:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
