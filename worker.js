export default {
    async fetch(request) {
        const url = new URL(request.url);
        const originalDomain = "metservice.intnet.mu"; // Original website
        const proxyDomain = "www.metservice.mu"; // Your custom domain

        // Construct the new URL to fetch from the original site
        const targetUrl = "https://" + originalDomain + url.pathname + url.search;

        // Fetch the response from the original website
        let response = await fetch(targetUrl, {
            headers: {
                "User-Agent": request.headers.get("User-Agent"),
                "Referer": targetUrl,
            }
        });

        // If the response is HTML, replace all instances of the original domain
        if (contentType.includes("text/html") || contentType.includes("javascript") || contentType.includes("css")) {
            let body = await response.text();
            body = body.replace(new RegExp(originalDomain, "g"), proxyDomain);
            
            return new Response(body, {
                status: response.status,
                headers: { "Content-Type": contentType }
            });
        }

        // Return other content types (images, etc.) unchanged
        return response;
    }
};
