export default {
    async fetch(request) {
        const url = new URL(request.url);
        const originalDomain = "metservice.intnet.mu"; // Original domain
        const proxyDomain = "www.metservice.mu"; // Your custom domain

        // Construct the target URL
        const targetUrl = "https://" + originalDomain + url.pathname + url.search;

        // Fetch the response from the original site
        let response = await fetch(targetUrl, {
            headers: {
                "User-Agent": request.headers.get("User-Agent"),
                "Referer": targetUrl
            }
        });

        // Clone response to modify headers
        let modifiedResponse = new Response(response.body, response);
        let contentType = modifiedResponse.headers.get("Content-Type") || "";

        // If it's HTML, JavaScript, or CSS, rewrite all occurrences of the original domain
        if (contentType.includes("text/html") || contentType.includes("javascript") || contentType.includes("css")) {
            let body = await response.text();
            
            // Replace all instances of the old domain with the new one
            body = body.replace(new RegExp(originalDomain, "g"), proxyDomain);

            return new Response(body, {
                status: response.status,
                headers: {
                    "Content-Type": contentType
                }
            });
        }

        // Return other content types (images, fonts, etc.) unchanged
        return response;
    }
};
