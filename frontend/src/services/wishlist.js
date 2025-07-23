
import API from "../api";

export const addToWishlist = async (productUrl) => {
    try {
        const res = await API.post("/wishlist/add", { productUrl });
        return res.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || "Failed to add item to wishlist");
    }
};

export const getWishlist = async () => {
    try {
        const res = await API.get("/wishlist");
        return res.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || "Failed to fetch wishlist");
    }
};

export const removeFromWishlist = async (id) => {
    try {
        const res = await API.delete(`/wishlist/remove/${id}`);
        return res.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || "Failed to remove item from wishlist");
    }
};
