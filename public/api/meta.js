export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing ID parameter" });
  }

  try {
    // ✅ Step 1: Get API Token
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Authentication token missing.");
    }

    // ✅ Step 2: Fetch Opportunity Details
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

    if (!opportunity) {
      throw new Error("Invalid Opportunity Data");
    }

    // ✅ Step 3: Serve Open Graph Metadata for Social Media Sharing
    const isBot = [
      "facebookexternalhit",
      "WhatsApp",
      "Twitterbot",
      "LinkedInBot",
      "Slackbot",
      "TelegramBot"
    ].some(agent => req.headers["user-agent"]?.includes(agent));

    if (isBot) {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
            <title>${opportunity.title}</title>

            <!-- ✅ Open Graph Metadata -->
            <meta property="og:title" content="${opportunity.title}">
            <meta property="og:description" content="${opportunity.description}">
            <meta property="og:image" content="${opportunity.visual}">
            <meta property="og:url" content="https://capital-web-puce.vercel.app/RootNavView/OpportunityDetails?id=${id}">
            <meta property="og:type" content="website">

            <!-- ✅ Twitter Card Metadata -->
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="${opportunity.title}">
            <meta name="twitter:description" content="${opportunity.description}">
            <meta name="twitter:image" content="${opportunity.visual}">
        </head>
        <body>
            <p>Opportunity Details: ${opportunity.title}</p>
        </body>
        </html>
      `);
    }

    // ✅ Step 4: Redirect Users to the Actual App (for Deep Linking)
    res.setHeader("Content-Type", "application/json");
    res.status(302).json({
      redirectUrl: `https://capital-web-puce.vercel.app/RootNavView/OpportunityDetails?id=${id}`
    });

  } catch (error) {
    console.error("Error fetching metadata:", error);
    res.status(500).json({ error: "Failed to fetch metadata" });
  }
}

/**
 * ✅ Securely Fetch API Token
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
    return responseData.result?.token || responseData.result[0]; // ✅ Fetch Token Safely
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}