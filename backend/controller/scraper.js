import * as cheerio from "cheerio";
import axios from "axios";
import puppeteer from "puppeteer";

export const scrapeProductInfo = async (url, options = {}) => {
    const {
        usePuppeteer = false,
        timeout = 30000,
        waitFor = null,
        blockImages = true,
        userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        retryWithPuppeteer = true
    } = options;

    let result;
    let scrapingMethod;

    try {
        if (usePuppeteer) {
            // Direct Puppeteer usage
            const html = await scrapeWithPuppeteer(url, { timeout, waitFor, blockImages, userAgent });
            result = await extractProductData(html, url, "puppeteer");
        } else {
            // Try Axios first
            try {
                const html = await scrapeWithAxios(url, userAgent);
                result = await extractProductData(html, url, "axios");

                // Check if critical data is missing and retry with Puppeteer
                if (retryWithPuppeteer && shouldRetryWithPuppeteer(result)) {
                    console.log("Critical data missing with Axios, retrying with Puppeteer...");
                    const puppeteerHtml = await scrapeWithPuppeteer(url, { timeout, waitFor, blockImages, userAgent });
                    const puppeteerResult = await extractProductData(puppeteerHtml, url, "puppeteer-retry");

                    // Merge results, preferring Puppeteer data for missing fields
                    result = mergeResults(result, puppeteerResult);
                }
            } catch (axiosError) {
                console.log("Axios failed, falling back to Puppeteer:", axiosError.message);
                const html = await scrapeWithPuppeteer(url, { timeout, waitFor, blockImages, userAgent });
                result = await extractProductData(html, url, "puppeteer-fallback");
            }
        }

        console.log("Enhanced scraper result:", result);
        return result;

    } catch (err) {
        console.error("Scraper error:", err.message);
        return {
            title: "Failed to Load Product",
            image: null,
            price: null,
            originalPrice: null,
            status: "UNAVAILABLE",
            availability: "UNKNOWN",
            isOnSale: false,
            discountPercentage: 0,
            description: null,
            specifications: {},
            scrapingMethod: "failed",
            lastChecked: new Date(),
            error: err.message
        };
    }
};

// Extract product data from HTML
const extractProductData = async (html, url, scrapingMethod) => {
    const $ = cheerio.load(html);

    // Extract product information
    const title = extractTitle($);
    const image = extractImage($, url);
    const priceData = extractPrices($);
    const availabilityData = checkAvailability($);
    const specs = extractProductSpecs($);
    const description = extractDescription($);

    // Determine if on sale
    const isOnSale = priceData.originalPrice &&
        priceData.currentPrice &&
        priceData.originalPrice !== priceData.currentPrice;

    // Calculate discount percentage
    const discountPercentage = calculateDiscountPercentage(
        priceData.currentPrice,
        priceData.originalPrice
    );

    return {
        title: title || "Product Title Not Found",
        image: image || null,
        price: priceData.currentPrice,
        originalPrice: priceData.originalPrice,
        status: availabilityData.status,
        availability: availabilityData.availability,
        isOnSale,
        discountPercentage,
        description: description || null,
        specifications: specs,
        scrapingMethod,
        lastChecked: new Date(),
    };
};

// Check if we should retry with Puppeteer based on missing critical data
const shouldRetryWithPuppeteer = (result) => {
    const criticalDataMissing = (
        !result.price || // No price found
        result.title === "Product Title Not Found" || // Generic title
        (result.title && (
            result.title.includes("Shop Online") || // Generic shop titles
            result.title.includes("Fashion") ||
            result.title.includes("Clothing") ||
            result.title.length < 10 // Very short titles
        )) ||
        (!result.image || result.image.includes('placeholder')) // No proper image
    );

    const suspiciousData = (
        result.description && result.description.includes("All fashion inspiration") || // Generic descriptions
        result.title && result.title === result.description // Title same as description
    );

    return criticalDataMissing || suspiciousData;
};

// Merge results from different scraping methods, preferring non-null values
const mergeResults = (axiosResult, puppeteerResult) => {
    return {
        title: puppeteerResult.title !== "Product Title Not Found" ? puppeteerResult.title : axiosResult.title,
        image: puppeteerResult.image || axiosResult.image,
        price: puppeteerResult.price || axiosResult.price,
        originalPrice: puppeteerResult.originalPrice || axiosResult.originalPrice,
        status: puppeteerResult.status !== "AVAILABLE" ? puppeteerResult.status : axiosResult.status,
        availability: puppeteerResult.availability !== "UNKNOWN" ? puppeteerResult.availability : axiosResult.availability,
        isOnSale: puppeteerResult.isOnSale !== null ? puppeteerResult.isOnSale : axiosResult.isOnSale,
        discountPercentage: puppeteerResult.discountPercentage > 0 ? puppeteerResult.discountPercentage : axiosResult.discountPercentage,
        description: (puppeteerResult.description && !puppeteerResult.description.includes("All fashion inspiration"))
            ? puppeteerResult.description : axiosResult.description,
        specifications: Object.keys(puppeteerResult.specifications).length > 0
            ? puppeteerResult.specifications : axiosResult.specifications,
        scrapingMethod: puppeteerResult.scrapingMethod,
        lastChecked: new Date(),
    };
};

// Axios-based scraping (fast but may be blocked)
const scrapeWithAxios = async (url, userAgent) => {
    const { data } = await axios.get(url, {
        headers: {
            "User-Agent": userAgent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Referer": "https://www.google.com/",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "cross-site",
            "Cache-Control": "max-age=0"
        },
        timeout: 10000,
        maxRedirects: 5
    });
    return data;
};

// Puppeteer-based scraping (slower but bypasses most blocks)
const scrapeWithPuppeteer = async (url, options) => {
    const { timeout, waitFor, blockImages, userAgent } = options;

    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--window-size=1920,1080'
        ]
    });

    let page;
    try {
        page = await browser.newPage();

        // Set user agent
        await page.setUserAgent(userAgent);

        // Set viewport
        await page.setViewport({ width: 1920, height: 1080 });

        // Block images and other resources to speed up loading
        if (blockImages) {
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const resourceType = req.resourceType();
                if (['image', 'font', 'media'].includes(resourceType)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });
        }

        // Add extra headers to look more like a real browser
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
        });

        // Navigate to the page
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout
        });

        // Wait for specific elements if specified
        if (waitFor) {
            try {
                if (typeof waitFor === 'string') {
                    await page.waitForSelector(waitFor, { timeout: 5000 });
                } else if (typeof waitFor === 'number') {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second

                }
            } catch (waitError) {
                console.log("Wait condition not met, continuing:", waitError.message);
            }
        }

        // Wait for common price selectors to load
        try {
            await page.waitForFunction(() => {
                const priceSelectors = ['.price', '.product-price', '[data-price]', '.money', '.amount'];
                return priceSelectors.some(selector => document.querySelector(selector));
            }, { timeout: 5000 });
        } catch (e) {
            console.log("Price elements not found within timeout, continuing...");
        }


        // Scroll down to trigger lazy loading
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight / 2);
        });
        await new Promise(resolve => setTimeout(resolve, 3000)); // wait 1 second


        // Get the HTML content
        const html = await page.content();
        return html;

    } finally {
        if (page) await page.close();
        await browser.close();
    }
};

// Enhanced availability checking
const checkAvailability = ($) => {
    const pageText = $('body').text().toLowerCase();
    const availabilitySelectors = [
        '.stock-status',
        '.availability',
        '.product-availability',
        '.inventory-status',
        '.stock-info',
        '[data-availability]',
        '.product-form__buttons button',
        '.add-to-cart',
        '.buy-now',
        '.btn-primary',
        '.product-add-to-cart',
        '[data-testid="add-to-cart"]'
    ];

    // Enhanced keywords with more variations
    const outOfStockKeywords = [
        'out of stock', 'sold out', 'unavailable', 'not available',
        'temporarily unavailable', 'stock نہیں', 'ختم', 'دستیاب نہیں',
        'notify when available', 'email me when available', 'currently unavailable',
        'out-of-stock', 'soldout', 'not in stock'
    ];

    const inStockKeywords = [
        'in stock', 'available', 'add to cart', 'buy now', 'order now',
        'خرید', 'دستیاب', 'add to bag', 'purchase', 'get it now',
        'shop now', 'in-stock'
    ];

    const limitedStockKeywords = [
        'limited stock', 'few left', 'last pieces', 'hurry', 'only',
        'محدود', 'limited quantity', 'almost gone', 'low stock'
    ];

    // Check availability text
    let availabilityText = '';
    for (const selector of availabilitySelectors) {
        const element = $(selector);
        if (element.length > 0) {
            availabilityText += ' ' + element.text().toLowerCase();
        }
    }

    // Check if add to cart button is disabled
    const addToCartButton = $('.add-to-cart, [data-action="add-to-cart"], .product-form__cart-submit, .btn-primary');
    const isButtonDisabled = addToCartButton.prop('disabled') ||
        addToCartButton.hasClass('disabled') ||
        addToCartButton.attr('aria-disabled') === 'true' ||
        addToCartButton.hasClass('btn-disabled');

    // Determine availability
    let availability = "UNKNOWN";
    let status = "AVAILABLE";

    if (outOfStockKeywords.some(keyword => pageText.includes(keyword)) || isButtonDisabled) {
        availability = "OUT_OF_STOCK";
        status = "OUT_OF_STOCK";
    } else if (limitedStockKeywords.some(keyword => pageText.includes(keyword))) {
        availability = "LIMITED_STOCK";
        status = "AVAILABLE";
    } else if (inStockKeywords.some(keyword => pageText.includes(keyword))) {
        availability = "IN_STOCK";
        status = "AVAILABLE";
    } else if (availabilityText || addToCartButton.length > 0) {
        availability = "IN_STOCK";
        status = "AVAILABLE";
    }

    return { availability, status };
};

// Enhanced title extraction
const extractTitle = ($) => {
    const titleSelectors = [
        "h1.product-title",
        "h1.product-name",
        ".product-title",
        ".product-name",
        "[data-testid='product-title']",
        ".pdp-product-name",
        ".product-details h1",
        "h1",
        "meta[property='og:title']",
        "meta[name='twitter:title']",
        "title"
    ];

    for (const selector of titleSelectors) {
        let title = '';
        if (selector.includes('meta')) {
            title = $(selector).attr("content");
        } else {
            title = $(selector).first().text().trim();
        }
        if (title && title.length > 3) {
            // Clean up title
            title = title.replace(/\s+/g, ' ').trim();
            // Remove common site names from title
            title = title.replace(/\s*[-|]\s*.+$/, '').trim();
            return title;
        }
    }
    return null;
};

// Enhanced image extraction with absolute URL handling
const extractImage = ($, baseUrl) => {
    const imageSelectors = [
        "meta[property='og:image']",
        "meta[name='twitter:image']",
        "img.product-image",
        ".product-image img",
        ".gallery-image img",
        "[data-testid='product-image'] img",
        ".product-photos img",
        ".product-gallery img",
        ".product-media img",
        "img[data-src]",
        "img[src*='product']",
        "img"
    ];

    for (const selector of imageSelectors) {
        let imageSrc = '';
        if (selector.includes('meta')) {
            imageSrc = $(selector).attr("content");
        } else {
            const imgElement = $(selector).first();
            imageSrc = imgElement.attr("src") || imgElement.attr("data-src") || imgElement.attr("data-lazy-src");
        }

        if (imageSrc && imageSrc.length > 10) {
            // Convert to absolute URL
            imageSrc = makeAbsoluteUrl(imageSrc, baseUrl);
            // Skip placeholder/loading images
            if (!imageSrc.includes('placeholder') && !imageSrc.includes('loading') && !imageSrc.includes('1x1')) {
                return imageSrc;
            }
        }
    }
    return null;
};

// Helper function to make URLs absolute
const makeAbsoluteUrl = (url, baseUrl) => {
    if (url.startsWith('http')) {
        return url;
    } else if (url.startsWith('//')) {
        return 'https:' + url;
    } else if (url.startsWith('/')) {
        const urlObj = new URL(baseUrl);
        return `${urlObj.protocol}//${urlObj.host}${url}`;
    }
    return url;
};

// Enhanced price extraction
const extractPrices = ($) => {
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
        '.price__current',
        '.price__sale',
        '.price__regular',
        '.product-form__cart-submit span',
        '[data-testid="price"]',
        '.pdp-price',
        '.price-display'
    ];

    // Try different selectors
    for (const selector of priceSelectors) {
        const priceElement = $(selector);
        if (priceElement.length > 0) {
            rawPriceText = priceElement.text().trim();
            if (rawPriceText) break;
        }
    }

    // Check data attributes
    if (!rawPriceText) {
        const priceData = $('[data-price]').attr('data-price') ||
            $('[data-price-amount]').attr('data-price-amount') ||
            $('[data-product-price]').attr('data-product-price');
        if (priceData) {
            rawPriceText = priceData;
        }
    }

    // Try JSON-LD structured data
    if (!rawPriceText) {
        const jsonLd = $('script[type="application/ld+json"]');
        jsonLd.each((i, elem) => {
            try {
                const data = JSON.parse($(elem).html());
                if (data.offers && data.offers.price) {
                    rawPriceText = data.offers.price.toString();
                    return false; // break
                }
            } catch (e) {
                // Ignore JSON parsing errors
            }
        });
    }

    return extractAndCleanPrices(rawPriceText);
};

// Extract product description
const extractDescription = ($) => {
    const descriptionSelectors = [
        '.product-description',
        '.product-details',
        '[data-testid="product-description"]',
        '.product-summary',
        '.description',
        '.product-info',
        'meta[name="description"]',
        'meta[property="og:description"]'
    ];

    for (const selector of descriptionSelectors) {
        let description = '';
        if (selector.includes('meta')) {
            description = $(selector).attr("content");
        } else {
            description = $(selector).first().text().trim();
        }
        if (description && description.length > 20) {
            return description.substring(0, 500); // Limit length
        }
    }
    return null;
};

// Extract product specifications
const extractProductSpecs = ($) => {
    const specs = {};

    // Look for specification tables or lists
    const specSelectors = [
        '.specifications table tr',
        '.product-specs tr',
        '.spec-table tr',
        '.features li',
        '.attributes .attribute'
    ];

    specSelectors.forEach(selector => {
        $(selector).each((i, elem) => {
            const $elem = $(elem);
            let key, value;

            if (selector.includes('tr')) {
                const cells = $elem.find('td');
                if (cells.length >= 2) {
                    key = $(cells[0]).text().trim();
                    value = $(cells[1]).text().trim();
                }
            } else if (selector.includes('li')) {
                const text = $elem.text().trim();
                const colonIndex = text.indexOf(':');
                if (colonIndex > 0) {
                    key = text.substring(0, colonIndex).trim();
                    value = text.substring(colonIndex + 1).trim();
                }
            }

            if (key && value && key.length < 50 && value.length < 200) {
                specs[key] = value;
            }
        });
    });

    return specs;
};

// Your existing helper functions (keeping them as they are good)
const extractAndCleanPrices = (rawText) => {
    if (!rawText) return { currentPrice: null, originalPrice: null };

    const cleanText = rawText.replace(/\s+/g, " ").trim();
    const lowerText = cleanText.toLowerCase();

    const pricePatterns = [
        /(?:PKR|Rs\.?|₨)\s*([0-9,]+(?:\.[0-9]{2})?)/gi,
        /([0-9,]+(?:\.[0-9]{2})?)\s*(?:PKR|Rs\.?|₨)/gi,
        /\$\s*([0-9,]+(?:\.[0-9]{2})?)/gi,
        /([0-9,]+(?:\.[0-9]{2})?)/g
    ];

    let priceMatches = [];
    for (const pattern of pricePatterns) {
        priceMatches = [...cleanText.matchAll(pattern)];
        if (priceMatches.length > 0) break;
    }

    if (priceMatches.length === 0) return { currentPrice: null, originalPrice: null };

    const prices = [...new Set(priceMatches.map(m => {
        const numStr = m[1].replace(/,/g, '');
        return parseInt(numStr);
    }))].filter(p => !isNaN(p) && p > 0);

    if (prices.length === 1) {
        return {
            currentPrice: formatPrice(prices[0]),
            originalPrice: null
        };
    }

    const discountMatch = cleanText.match(/-(\d+)%/);
    const discountPercent = discountMatch ? parseInt(discountMatch[1]) : 0;

    if (discountPercent <= 5) {
        return {
            currentPrice: formatPrice(prices[0]),
            originalPrice: null
        };
    }

    const hasSaleIndicators = lowerText.includes('sale') ||
        lowerText.includes('discount') ||
        discountPercent > 5;

    if (hasSaleIndicators && prices.length >= 2) {
        const sortedPrices = prices.sort((a, b) => b - a);
        return {
            currentPrice: formatPrice(sortedPrices[1]),
            originalPrice: formatPrice(sortedPrices[0])
        };
    }

    return {
        currentPrice: formatPrice(prices[0]),
        originalPrice: null
    };
};

const formatPrice = (number) => {
    return `PKR ${number.toLocaleString()}`;
};

const calculateDiscountPercentage = (currentPrice, originalPrice) => {
    if (!currentPrice || !originalPrice) return 0;

    const current = parseInt(currentPrice.replace(/[^\d]/g, ''));
    const original = parseInt(originalPrice.replace(/[^\d]/g, ''));

    if (original <= current) return 0;

    return Math.round(((original - current) / original) * 100);
};

// Enhanced helper function to update existing items
export const updateItemStatus = (item) => {
    const isOnSale = item.originalPrice &&
        item.price &&
        item.originalPrice !== item.price;

    const discountPercentage = calculateDiscountPercentage(item.price, item.originalPrice);

    return {
        ...item,
        isOnSale,
        discountPercentage,
        lastChecked: new Date(),
    };
};

// Utility function to detect if a site might need Puppeteer
export const shouldUsePuppeteer = async (url) => {
    try {
        const response = await axios.head(url, { timeout: 5000 });
        const contentType = response.headers['content-type'] || '';

        // If it's not HTML, probably doesn't need Puppeteer
        if (!contentType.includes('text/html')) {
            return false;
        }

        // Check for common indicators that suggest heavy JS usage
        const server = response.headers['server'] || '';
        const via = response.headers['via'] || '';

        if (server.includes('cloudflare') || via.includes('cloudflare')) {
            return true; // Cloudflare often indicates bot protection
        }

        return false;
    } catch (error) {
        // If HEAD request fails, might need Puppeteer
        return true;
    }
};

// Batch scraping function for multiple URLs
export const scrapeMultipleProducts = async (urls, options = {}) => {
    const { concurrent = 3, delay = 1000 } = options;
    const results = [];

    for (let i = 0; i < urls.length; i += concurrent) {
        const batch = urls.slice(i, i + concurrent);
        const batchPromises = batch.map(url =>
            scrapeProductInfo(url, options).catch(error => ({
                url,
                error: error.message,
                status: 'FAILED'
            }))
        );

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Add delay between batches to be respectful
        if (i + concurrent < urls.length) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    return results;
};