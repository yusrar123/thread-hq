import * as cheerio from "cheerio";
import axios from "axios";

export const scrapeProductInfo = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: {

                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.google.com/",
                "Connection": "keep-alive",

            },
        });

        const $ = cheerio.load(data);

        // Debug: Log the HTML to see what we're getting
        console.log("Page title:", $("title").text());
        console.log("Available price selectors:", {
            productPrice: $(".product-price").length,
            price: $(".price").length,
            priceBox: $(".price-box").length,
            currentPrice: $(".current-price").length,
            salePrice: $(".sale-price").length,
        });

        // Extract title with more selectors
        const title =
            $("h1.product-title").text().trim() ||
            $("h1.product-name").text().trim() ||
            $(".product-title").text().trim() ||
            $(".product-name").text().trim() ||
            $("h1").first().text().trim() ||
            $("meta[property='og:title']").attr("content") ||
            $("title").text().trim();

        // Extract image with more selectors
        const image =
            $("meta[property='og:image']").attr("content") ||
            $("img.product-image").attr("src") ||
            $(".product-image img").attr("src") ||
            $(".gallery-image img").first().attr("src") ||
            $("img[data-src]").first().attr("data-src") ||
            $("img").first().attr("src");

        // Enhanced price extraction with more selectors
        let rawPriceText = '';
        const priceSelectors = [
            '.product-price',
            '.price',
            '.price-box',
            '.current-price',
            '.sale-price',
            '.product-price-value',
            '.price-current',
            '[data-price]',
            '.money',
            '.amount',
            // Shopify specific selectors
            '.price__current',
            '.price__sale',
            '.price__regular',
            '.product-form__cart-submit span',
        ];

        for (const selector of priceSelectors) {
            const priceElement = $(selector);
            if (priceElement.length > 0) {
                rawPriceText = priceElement.text().trim();
                console.log(`Found price with selector "${selector}":`, rawPriceText);
                if (rawPriceText) break;
            }
        }

        // Also check data attributes
        if (!rawPriceText) {
            const priceData = $('[data-price]').attr('data-price') ||
                $('[data-price-amount]').attr('data-price-amount') ||
                $('[data-product-price]').attr('data-product-price');
            if (priceData) {
                rawPriceText = priceData;
                console.log("Found price in data attribute:", rawPriceText);
            }
        }

        // Check script tags for JSON-LD structured data and Shopify product data
        if (!rawPriceText) {
            $('script[type="application/ld+json"]').each((i, elem) => {
                try {
                    const jsonData = JSON.parse($(elem).html());
                    if (jsonData.offers && jsonData.offers.price) {
                        rawPriceText = `PKR ${jsonData.offers.price}`;
                        console.log("Found price in JSON-LD:", rawPriceText);
                        return false; // Break out of each loop
                    }
                } catch (e) {
                    // Continue if JSON parsing fails
                }
            });

            // Check for Shopify product JSON
            $('script').each((i, elem) => {
                const scriptContent = $(elem).html();
                if (scriptContent && scriptContent.includes('window.product') || scriptContent.includes('Product(')) {
                    const priceMatch = scriptContent.match(/"price":\s*(\d+)/);
                    if (priceMatch) {
                        // Shopify stores prices in cents, convert to rupees
                        const priceInCents = parseInt(priceMatch[1]);
                        const priceInRupees = priceInCents / 100;
                        rawPriceText = `PKR ${priceInRupees}`;
                        console.log("Found price in Shopify JSON:", rawPriceText);
                        return false;
                    }
                }
            });
        }

        console.log("Final raw price text:", rawPriceText);

        const cleanedPrices = extractAndCleanPrices(rawPriceText);

        const result = {
            title: title || "Product Title Not Found",
            image: image || null,
            price: cleanedPrices.currentPrice,
            originalPrice: cleanedPrices.originalPrice,
            status: cleanedPrices.currentPrice ? "AVAILABLE" : "UNAVAILABLE",
        };

        console.log("Scraper result:", result);
        return result;

    } catch (err) {
        console.error("Scraper error:", err.message);
        return {
            title: "Failed to Load Product",
            image: null,
            price: null,
            originalPrice: null,
            status: "UNAVAILABLE",
        };
    }
};

const extractAndCleanPrices = (rawText) => {
    if (!rawText) return { currentPrice: null, originalPrice: null };

    console.log("Extracting prices from:", rawText);

    // Normalize whitespace and convert to lowercase for analysis
    const cleanText = rawText.replace(/\s+/g, " ").trim();
    const lowerText = cleanText.toLowerCase();

    // Enhanced price regex to catch more formats
    const pricePatterns = [
        /(?:PKR|Rs\.?|₨)\s*([0-9,]+(?:\.[0-9]{2})?)/gi,
        /([0-9,]+(?:\.[0-9]{2})?)\s*(?:PKR|Rs\.?|₨)/gi,
        /\$\s*([0-9,]+(?:\.[0-9]{2})?)/gi,
        /([0-9,]+(?:\.[0-9]{2})?)/g // Fallback for just numbers
    ];

    let priceMatches = [];

    for (const pattern of pricePatterns) {
        priceMatches = [...cleanText.matchAll(pattern)];
        if (priceMatches.length > 0) {
            console.log(`Found prices with pattern ${pattern}:`, priceMatches.map(m => m[1]));
            break;
        }
    }

    if (priceMatches.length === 0) return { currentPrice: null, originalPrice: null };

    // Convert to numbers and remove duplicates
    const prices = [...new Set(priceMatches.map(m => {
        const numStr = m[1].replace(/,/g, '');
        return parseInt(numStr);
    }))].filter(p => !isNaN(p) && p > 0);

    console.log("Extracted numeric prices:", prices);

    // If only one unique price, return it as current price
    if (prices.length === 1) {
        return {
            currentPrice: formatPrice(prices[0]),
            originalPrice: null
        };
    }

    // Check for meaningful discount
    const discountMatch = cleanText.match(/-(\d+)%/);
    const discountPercent = discountMatch ? parseInt(discountMatch[1]) : 0;

    // If discount is 0% or very small (meaningless), treat as single price
    if (discountPercent <= 5) {
        return {
            currentPrice: formatPrice(prices[0]),
            originalPrice: null
        };
    }

    // Check for sale indicators
    const hasSaleIndicators = lowerText.includes('sale') ||
        lowerText.includes('discount') ||
        discountPercent > 5;

    if (hasSaleIndicators && prices.length >= 2) {
        // Sort prices: highest first (original), then current
        const sortedPrices = prices.sort((a, b) => b - a);
        return {
            currentPrice: formatPrice(sortedPrices[1]),
            originalPrice: formatPrice(sortedPrices[0])
        };
    }

    // Default: return first price as current
    return {
        currentPrice: formatPrice(prices[0]),
        originalPrice: null
    };
};

const formatPrice = (number) => {
    return `PKR ${number.toLocaleString()}`;
};

// Debug function to test specific URLs
export const debugScrapeUrl = async (url) => {
    console.log(`\n=== DEBUG SCRAPING: ${url} ===`);
    try {
        const { data } = await axios.get(url, {
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });

        const $ = cheerio.load(data);

        console.log("Page loaded successfully");
        console.log("Title:", $("title").text());

        // Log all elements that might contain price
        console.log("\n=== PRICE ELEMENTS ===");
        $("*").each((i, elem) => {
            const text = $(elem).text().trim();
            if (text.match(/PKR|Rs\.?|₨|\d+[,\d]*\.\d{2}|\d{4,}/)) {
                console.log(`${elem.tagName}.${$(elem).attr('class') || 'no-class'}: "${text}"`);
            }
        });

        return await scrapeProductInfo(url);
    } catch (error) {
        console.error("Debug scrape error:", error.message);
        return null;
    }
};