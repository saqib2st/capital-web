export default async function handler(req, res) {
  const { id } = req.query;

  let opportunity = {
    title: "Capital Connect",
    description: "Explore opportunities with Capital Connect.",
    visual: "https://capital-web-puce.vercel.app/default-image.jpg",
  };

  if (id) {
    try {
      const tokenRes = await fetch("https://api.capitalbelgium.be/api/youngster/generate-token", {
        method: "POST",
      });
      const tokenData = await tokenRes.json();
      const token = tokenData?.result?.[0];

      const oppRes = await fetch(`https://api.capitalbelgium.be/api/youngster/opportunities/${id}?lang=en`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const oppData = await oppRes.json();
      opportunity = {
        title: oppData.result.title || opportunity.title,
        description: oppData.result.description || opportunity.description,
        visual: oppData.result.visual || opportunity.visual,
      };
    } catch (err) {
      console.error("Error fetching opportunity:", err);
    }
  }

const universalLink = `https://capital-web-puce.vercel.app/open/RootNavView/OpportunityDetails?id=${id || ""}`;
  const appStoreURL = "https://apps.apple.com/app/id6742452533";
  const playStoreURL = "https://play.google.com/store/apps/details?id=com.capital.connect.app";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${sanitize(opportunity.title)}</title>

      <!-- Open Graph -->
      <meta property="og:type" content="website">
      <meta property="og:url" content="${universalLink}">
      <meta property="og:title" content="${sanitize(opportunity.title)}">
      <meta property="og:description" content="${sanitize(opportunity.description)}">
      <meta property="og:image" content="${opportunity.visual}">

      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${sanitize(opportunity.title)}">
      <meta name="twitter:description" content="${sanitize(opportunity.description)}">
      <meta name="twitter:image" content="${opportunity.visual}">

      <!-- iOS Smart Banner -->
      <meta name="apple-itunes-app" content="app-id=6742452533, app-argument=${universalLink}" />

      <script>
  function openApp() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    // Universal link must include the /open prefix
    const universalLink = "https://capital-web-puce.vercel.app/open" + window.location.search;
    const appStoreURL = "https://apps.apple.com/app/id6742452533";
    const playStoreURL = "https://play.google.com/store/apps/details?id=com.capital.connect.app";

    const fallback = () => {
      if (isIOS) {
        window.location.href = appStoreURL;
      } else if (isAndroid) {
        window.location.href = playStoreURL;
      } else {
        window.location.href = universalLink; // fallback for desktop
      }
    };

    if (isIOS) {
      // iOS tries universal link directly
      window.location.href = universalLink;

      // Fallback if app not installed
      setTimeout(() => {
        if (!document.hidden) fallback();
      }, 1200);
    } else if (isAndroid) {
      // Android tries universal link directly
      window.location.href = universalLink;

      // Fallback if app not installed
      setTimeout(() => {
        if (!document.hidden) fallback();
      }, 1200);
    } else {
      // Desktop or others
      fallback();
    }
  }

  // auto-open unless query param disables it
  if (!window.location.search.includes("noredirect=true")) {
    window.onload = openApp;
  }
</script>

    </head>
    <body>
      <div style="text-align:center; padding: 40px; font-family: sans-serif;">
        <h1>${sanitize(opportunity.title)}</h1>
        <p>${sanitize(opportunity.description)}</p>
        <img src="${opportunity.visual}" alt="Opportunity Image" style="max-width: 100%; border-radius: 8px;" />
        <br><br>
        <button onclick="openApp()" style="padding: 12px 24px; background-color: #007AFF; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer;">
          Open in App
        </button>
        <p style="margin-top: 10px;"><a href="${universalLink}?noredirect=true">View in Browser</a></p>
      </div>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}

function sanitize(str) {
  return String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
