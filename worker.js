export default {
    async fetch(request) {
        const url = new URL(request.url);
        const originalDomain = "metservice.intnet.mu"; // Original website
        const proxyDomain = "www.metservice.mu"; // Your custom domain

        // Construct the new URL to fetch from the original site
        const targetUrl = "http://" + originalDomain + url.pathname + url.search;

        // Fetch the response from the original website
        let response = await fetch(targetUrl, {
            headers: {
                "User-Agent": request.headers.get("User-Agent"),
                "Referer": targetUrl,
            }
        });

        // Check if the response is HTML
        let contentType = response.headers.get("Content-Type") || "";
        if (contentType.includes("text/html")) {
            let body = await response.text();

            // Replace all occurrences of the original domain with the proxy domain
            body = body.replace(new RegExp(originalDomain, "g"), proxyDomain);

            // Return the modified response
            return new Response(body, {
                status: response.status,
                headers: {
                    "Content-Type": "text/html"
                }
            });
        }

        // Return other content (CSS, JS, images, etc.) unchanged
        return response;
    }
};
