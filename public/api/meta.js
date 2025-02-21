export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch your opportunity data
    const opportunity = await fetchOpportunity(id);
    
    // Ensure we have a valid opportunity
    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    // Ensure image URL is absolute
    const imageUrl = opportunity.visual?.startsWith('http') 
      ? opportunity.visual 
      : `https://capital-web-puce.vercel.app${opportunity.visual}`;

    const sanitizedTitle = (opportunity.title || 'Capital Connect Opportunity').replace(/"/g, '&quot;');
    const sanitizedDescription = (opportunity.description || 'View this opportunity on Capital Connect').replace(/"/g, '&quot;');
    const baseUrl = 'https://capital-web-puce.vercel.app';

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          
          <title>${sanitizedTitle}</title>

          <!-- Open Graph -->
          <meta property="og:title" content="${sanitizedTitle}" />
          <meta property="og:description" content="${sanitizedDescription}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${baseUrl}/api/meta?id=${id}" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Capital Connect" />

          <!-- Twitter Card -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@capitalconnect" />
          <meta name="twitter:title" content="${sanitizedTitle}" />
          <meta name="twitter:description" content="${sanitizedDescription}" />
          <meta name="twitter:image" content="${imageUrl}" />

          <!-- Redirect -->
          <meta http-equiv="refresh" content="0;url=${baseUrl}/RootNavView/OpportunityDetails?id=${id}" />
      </head>
      <body>
          <p>Redirecting to opportunity details...</p>
      </body>
      </html>
    `;

    // Add debug headers to see what's being sent
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);

  } catch (error) {
    console.error('Meta generation error:', error);
    return res.status(500).json({ error: 'Failed to generate meta tags' });
  }
}

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
