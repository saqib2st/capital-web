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

  // Default meta tags
  const metaData = {
    title: opportunity.title || "Capital Connect",
    description:
      opportunity.description || "Explore opportunities with Capital Connect.",
    image: opportunity.visual || "default-image.png",
    url: `https://capital-web-puce.vercel.app/RootNavView/OpportunityDetails?id=${id}`,
  };

  // Generate HTML with meta tags
  const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${metaData.title}</title>
              <meta property="og:type" content="website">
              <meta property="og:title" content="${metaData.title}">
              <meta property="og:description" content="${metaData.description}">
              <meta property="og:image" content="${metaData.image}">
              <meta property="og:url" content="${metaData.url}">
              <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID">
              <meta name="twitter:card" content="summary_large_image">
              <meta name="twitter:title" content="${metaData.title}">
              <meta name="twitter:description" content="${
                metaData.description
              }">
              <meta name="twitter:image" content="${metaData.image}">
            </head>
            <body>
              <p>Redirecting to the store...</p>
              <script>
                // Client-side redirection logic
                ${redirectToStoreScript(id)}
              </script>
            </body>
            </html>
          `;

  res.status(200).send(html);
}

// Client-side redirection logic
function redirectToStoreScript(opportunityId) {
  return `
            async function generateToken() {
              const response = await fetch('https://api.capitalbelgium.be/api/youngster/generate-token', {
                method: 'POST',
              });
              const data = await response.json();
              return data.result[0]; // Returns the token
            }
        
            async function redirectToStore() {
              const userAgent = navigator.userAgent || navigator.vendor || window.opera;
              const appStoreURL = "https://apps.apple.com/app/6742452533";
              const playStoreURL = "https://play.google.com/store/apps/details?id=com.capital.connect.app";
              const fallbackURL = "https://capital-web-puce.vercel.app/";
        
              let finalAppStoreURL = appStoreURL;
              let finalPlayStoreURL = playStoreURL;
        
              if (${opportunityId ? `'${opportunityId}'` : "null"}) {
                try {
                  // Generate token
                  const token = await generateToken();
                  // Append the opportunity ID to the store URLs
                  finalAppStoreURL = appStoreURL;
                  finalPlayStoreURL += '&id=${opportunityId}';
                } catch (error) {
                  console.error('Error fetching token:', error);
                }
              }
        
              // Check if the user is on an iOS device
              if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                window.location.href = finalAppStoreURL;
              }
              // Check if the user is on an Android device
              else if (/android/i.test(userAgent)) {
                window.location.href = finalPlayStoreURL;
              }
              // Fallback for desktop or other devices
              else {
                window.location.href = playStoreURL;
              }
            }
        
            window.onload = redirectToStore;
          `;
}
