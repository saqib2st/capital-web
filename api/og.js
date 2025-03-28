// api/og.js
export default async function handler(req, res) {
  const { id } = req.query;

  // Fetch opportunity details from your API
  let opportunity = {};
  if (id) {
    try {
      // Generate token
      const tokenResponse = await fetch(
        "https://api.capitalbelgium.be/api/youngster/generate-token",
        {
          method: "POST",
        }
      );
      const tokenData = await tokenResponse.json();
      const token = tokenData.result[0];

      // Fetch opportunity details
      const opportunityResponse = await fetch(
        `https://api.capitalbelgium.be/api/youngster/opportunities/${id}?lang=en`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const opportunityData = await opportunityResponse.json();
      opportunity = opportunityData.result;
    } catch (error) {
      console.error("Error fetching opportunity details:", error);
    }
  }

  // Universal Link for iOS
  const universalLink = `https://capital-web-puce.vercel.app/RootNavView/OpportunityDetails?id=${id || ''}`;
  
  // App Store URLs
  const appStoreURL = "https://apps.apple.com/app/6742452533";
  const playStoreURL = "https://play.google.com/store/apps/details?id=com.capital.connect.app";

  // Generate HTML with meta tags and smart redirection
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${opportunity.title || "Capital Connect"}</title>
      <meta property="og:type" content="website">
      <meta property="og:title" content="${opportunity.title || "Capital Connect"}">
      <meta property="og:description" content="${opportunity.description || "Explore opportunities with Capital Connect."}">
      <meta property="og:image" content="${opportunity.visual || "default-image.png"}">
      <meta property="og:url" content="https://capital-web-puce.vercel.app/RootNavView/OpportunityDetails?id=${id || ''}">
      
      <!-- Smart App Banner for iOS -->
      <meta name="apple-itunes-app" content="app-id=6742452533, app-argument=${universalLink}">
      
      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${opportunity.title || "Capital Connect"}">
      <meta name="twitter:description" content="${opportunity.description || "Explore opportunities with Capital Connect."}">
      <meta name="twitter:image" content="${opportunity.visual || "default-image.png"}">
      
      <script>
        // Universal Link handling with fallback
        function openApp() {
          const userAgent = navigator.userAgent.toLowerCase();
          const isIOS = /iphone|ipad|ipod/.test(userAgent);
          const isAndroid = /android/.test(userAgent);
          
          // Try to open the app directly
          if (isIOS) {
            // iOS Universal Link with iframe workaround
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = '${universalLink}';
            document.body.appendChild(iframe);
            
            setTimeout(() => {
              if (!document.hidden) {
                window.location.href = '${appStoreURL}';
              }
              document.body.removeChild(iframe);
            }, 500);
            
            window.addEventListener('blur', () => {
              document.body.removeChild(iframe);
            });
          } 
          else if (isAndroid) {
            // Android App Link
            window.location.href = '${universalLink}';
            setTimeout(() => {
              if (!document.hidden) {
                window.location.href = '${playStoreURL}';
              }
            }, 500);
          }
          else {
            // Desktop fallback
            window.location.href = '${playStoreURL}';
          }
        }
        
        // Auto-trigger for direct URL access
        if (!window.location.search.includes('noredirect=true')) {
          openApp();
        }
      </script>
    </head>
    <body>
      <div style="text-align: center; padding: 50px;">
        <h1>${opportunity.title || "Capital Connect"}</h1>
        <p>${opportunity.description || "Explore opportunities with Capital Connect."}</p>
        <button onclick="openApp()" style="padding: 10px 20px; background: #007AFF; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Open in App
        </button>
        <p>Or <a href="${universalLink}?noredirect=true">view in browser</a></p>
      </div>
    </body>
    </html>
  `;

  res.status(200).send(html);
}