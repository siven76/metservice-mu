export default {
    async fetch(request) {
        const url = new URL(request.url);
        const originalDomain = "metservice.intnet.mu"; // Original domain
        const proxyDomain = "www.metservice.mu"; // Your custom domain

        console.log(`Fetching: ${url.href}`);

        // Construct the target URL
        const targetUrl = "https://" + originalDomain + url.pathname + url.search;

        let response = await fetch(targetUrl, {
            headers: {
                "User-Agent": request.headers.get("User-Agent"),
                "Referer": targetUrl
            }
        });

        let contentType = response.headers.get("Content-Type") || "";
        console.log(`Response Content-Type: ${contentType}`);

        // Modify response body only if it's HTML, JavaScript, or CSS
        if (contentType.includes("text/html") || contentType.includes("javascript") || contentType.includes("css")) {
            let body = await response.text();
            
            console.log(`Modifying response from ${originalDomain} to ${proxyDomain}`);

            // Replace all instances of the original domain
            body = body.replace(new RegExp(originalDomain, "g"), proxyDomain);

            return new Response(body, {
                status: response.status,
                headers: {
                    "Content-Type": contentType
                }
            });
        }

        // Return other content types unchanged
        return response;
    }
};
