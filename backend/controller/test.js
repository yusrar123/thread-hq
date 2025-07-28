import {
    scrapeWithCheerio,
    scrapeWithPuppeteer,
    scrapeProductSmart,
    scrapeEthnicPk,
    scrapeZara
} from "./scraper.js";

async function testHybridScraper() {
    console.log("🧪 Testing Hybrid Scraper\n");

    const ethnicUrl = "https://pk.ethnc.com/products/rozana-top-e3237-103-602-602";
    const zaraUrl = "https://www.zara.com/ww/en/shell-polyamide-dress-p01026140.html?v1=462166275&v2=2546081";

    // Test 1: Ethnic.com with Cheerio only
    console.log("=== Test 1: Ethnic.com with Cheerio ===");
    try {
        const result1 = await scrapeWithCheerio(ethnicUrl);
        console.log("Cheerio result:", {
            success: result1.success,
            title: result1.title.substring(0, 50) + "...",
            price: result1.price,
            hasImage: !!result1.image,
            method: result1.method
        });
    } catch (error) {
        console.error("Cheerio test failed:", error.message);
    }

    // Test 2: Smart hybrid approach for Ethnic.com
    console.log("\n=== Test 2: Ethnic.com with Smart Hybrid ===");
    try {
        const result2 = await scrapeEthnicPk(ethnicUrl);
        console.log("Smart hybrid result:", {
            success: result2.success,
            title: result2.title.substring(0, 50) + "...",
            price: result2.price,
            hasImage: !!result2.image,
            method: result2.method
        });
    } catch (error) {
        console.error("Smart hybrid test failed:", error.message);
    }

    // Test 3: Zara (requires JS)
    console.log("\n=== Test 3: Zara (JS-heavy site) ===");
    try {
        const result3 = await scrapeZara(zaraUrl);
        console.log("Zara result:", {
            success: result3.success,
            title: result3.title,
            price: result3.price,
            hasImage: !!result3.image,
            method: result3.method
        });
    } catch (error) {
        console.error("Zara test failed:", error.message);
    }
}

// Simple test function for just the problematic URL
async function testEthnicOnly() {
    console.log("🎯 Testing Ethnic.com specifically\n");

    const url = "https://pk.ethnc.com/products/rozana-top-e3237-103-602-602";

    console.log("Method 1: Pure Cheerio");
    const cheerioResult = await scrapeWithCheerio(url);
    console.log("Result:", cheerioResult);

    if (!cheerioResult.success) {
        console.log("\nMethod 2: Puppeteer fallback");
        const puppeteerResult = await scrapeWithPuppeteer(url, {
            timeout: 30000,
            waitTime: 5000
        });
        console.log("Result:", puppeteerResult);
    }
}

// Run the test you want
console.log("Choose test:");
console.log("Full test: node test.js");
console.log("Ethnic only: Uncomment testEthnicOnly() call below");

// testEthnicOnly(); // Uncomment this for focused testing
testHybridScraper();