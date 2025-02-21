export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing ID parameter" });
  }

  try {
    // ✅ 1. Get Token Securely
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Authentication token missing.");
    }

    // ✅ 2. Fetch Opportunity Details
    const apiUrl = `https://api.capitalbelgium.be/api/youngster/opportunities/${id}?lang=en`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const opportunity = data.result;

    // ✅ 3. Serve Metadata FIRST, Then Redirect
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          
          <title>${opportunity.title}</title>

          <!-- Open Graph Metadata for WhatsApp, Skype, Facebook -->
          <meta property="og:title" content="${opportunity.title}">
          <meta property="og:description" content="${opportunity.description}">
          <meta property="og:image" content="${opportunity.visual}">
          <meta property="og:url" content="https://capital-web-puce.vercel.app/RootNavView/OpportunityDetails?id=${id}">
          <meta property="og:type" content="website">

          <!-- Twitter Card Metadata -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${opportunity.title}">
          <meta name="twitter:description" content="${opportunity.description}">
          <meta name="twitter:image" content="${opportunity.visual}">

          <!-- ✅ No Redirect for OG Bots, Only for Users -->
          <script>
              if (navigator.userAgent.indexOf("facebookexternalhit") === -1 && 
                  navigator.userAgent.indexOf("WhatsApp") === -1 && 
                  navigator.userAgent.indexOf("Twitterbot") === -1) {
                  window.location.href = "https://capital-web-puce.vercel.app/RootNavView/OpportunityDetails?id=${id}";
              }
          </script>
      </head>
      <body>
          <p>Redirecting to opportunity details...</p>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error fetching metadata:", error);
    res.status(500).json({ error: "Failed to fetch metadata" });
  }
}

/**
 * ✅ Fetch Authentication Token Securely
 */
async function getAuthToken() {
  try {
    const loginResponse = await fetch("https://api.capitalbelgium.be/api/youngster/generate-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    if (!loginResponse.ok) {
      throw new Error(`Token Generation Failed: ${loginResponse.statusText}`);
    }

    const responseData = await loginResponse.json();
    return responseData.result[0]; // ✅ Corrected: Token is at index 0
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}
