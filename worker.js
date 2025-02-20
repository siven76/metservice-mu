export default {
    async fetch(request) {
        const url = new URL(request.url);
        const originalDomain = "metservice.intnet.mu";
        const proxyDomain = "www.metservice.mu";

        // Construct the target URL
        const targetUrl = "http://" + originalDomain + url.pathname + url.search;

        let response = await fetch(targetUrl, {
            headers: {
                "User-Agent": request.headers.get("User-Agent"),
                "Referer": targetUrl
            }
        });

        let contentType = response.headers.get("Content-Type") || "";

        // Modify response body only if it's HTML, JavaScript, or CSS
        if (contentType.includes("text/html") || contentType.includes("javascript") || contentType.includes("css")) {
            let body = await response.text();

            if (contentType.includes("text/html")) {
                // Force Google to prefer the new domain with a strong canonical signal
                body = body.replace(
                    /<head>/i,
                    `<head>\n<link rel="canonical" href="https://${proxyDomain}${url.pathname}" />\n<meta name="robots" content="index, follow">\n`
                );
            }

            // Replace HTTP links with HTTPS
            body = body.replace(new RegExp('http://' + originalDomain, "g"), 'https://' + proxyDomain);

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
