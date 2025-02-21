export default async function handler(req, res) {
          const { id } = req.query;
        
          if (!id) {
            return res.status(400).json({ error: "Missing ID parameter" });
          }
        
          try {
            // 1️⃣ Get Token Securely from API
            const token = await getAuthToken();
        
            if (!token) {
              throw new Error("Authentication token missing.");
            }
        
            // 2️⃣ Fetch Opportunity Data Using Token
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
        
            // 3️⃣ Generate Metadata & Prevent Redirect Loops
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
        
                  <!-- 🛑 Only One Redirect After 3s to Avoid Infinite Loops -->
                  <meta http-equiv="refresh" content="3;url=https://capital-web-puce.vercel.app/RootNavView/OpportunityDetails?id=${id}">
              </head>
              <body>
                  <p>Redirecting to opportunity details...</p>
              </body>
              </html>
            `;
        
            res.setHeader("Content-Type", "text/html");
            res.send(html);
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
              headers: { "Content-Type": "application/json" },
            });
        
            if (!loginResponse.ok) {
              throw new Error(`Token Generation Failed: ${loginResponse.statusText}`);
            }
        
            const responseData = await loginResponse.json();
            return responseData.result[0]; // Token is first element in result array
          } catch (error) {
            console.error("Error fetching token:", error);
            return null;
          }
        }
        
