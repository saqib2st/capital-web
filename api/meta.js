export default async function handler(req, res) {
          const { id } = req.query;

          if (!id) {
                    return res.status(400).json({ error: "Missing ID parameter" });
          }

          try {
                    // Define your Laravel API URL
                    const apiUrl = `https://api.capitalbelgium.be/api/youngster/opportunities/${id}?lang=en`;

                    // Securely store the API token in Vercel environment variables
                    const token = await getAuthToken();

                    // Fetch opportunity data from Laravel API with authentication
                    const response = await fetch(apiUrl, {
                              method: "GET",
                              headers: {
                                        "Authorization": `Bearer 62|bohCXQFbTiq5ziajR5kNq4d3Qm3HxAExyXEq0AR2179e61a7`,
                                        "Content-Type": "application/json"
                              }
                    });

                    // Handle error if API request fails
                    if (!response.ok) {
                              throw new Error(`API Error: ${response.statusText}`);
                    }

                    const data = await response.json();
                    const opportunity = data.result;

                    // Generate meta tags dynamically
                    const html = `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  
                  <title>${opportunity.title}</title>
        
                  <!-- Open Graph (WhatsApp, Skype, Facebook) -->
                  <meta property="og:title" content="${opportunity.title}">
                  <meta property="og:description" content="${opportunity.description}">
                  <meta property="og:image" content="${opportunity.visual}">
                  <meta property="og:url" content="https://capital-web-puce.vercel.app/RootNavView/OpportunityDetails?id=${id}">
                  <meta property="og:type" content="website">
        
                  <!-- Twitter Card -->
                  <meta name="twitter:card" content="summary_large_image">
                  <meta name="twitter:title" content="${opportunity.title}">
                  <meta name="twitter:description" content="${opportunity.description}">
                  <meta name="twitter:image" content="${opportunity.visual}">
        
                  <!-- Redirect to actual opportunity page -->
                  <meta http-equiv="refresh" content="0;url=https://capital-web-puce.vercel.app/RootNavView/OpportunityDetails?id=${id}">
              </head>
              <body>
                  <p>Redirecting...</p>
              </body>
              </html>
            `;

                    res.setHeader("Content-Type", "text/html");
                    res.send(html);
          } catch (error) {
                    console.error("Error fetching metadata:", error);
                    res.status(500).json({ error: "Failed to fetch metadata" });
          }





          async function getAuthToken() {
                    const loginResponse = await fetch("https://api.capitalbelgium.be/api/youngster/login", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ email: "saqib.amin2323+test50@gmail.com", password: "Qwerty123$" })
                    });

                    const responseData = await loginResponse.json();
                    return responseData.result.token; // Updated to access token from the correct path
          }

}
