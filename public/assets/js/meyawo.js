document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const opportunityId = urlParams.get("id");

    var appStoreURL = "https://apps.apple.com/app/6742452533";
            var playStoreURL = "https://play.google.com/store/apps/details?id=com.capital.connect.app";
    var deepLink = `capitalconnect://RootNavView/OpportunityDetails?id=${opportunityId || ""}`;

    var isAndroid = /Android/i.test(navigator.userAgent);
    var isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    function openAppOrRedirect() {
        if (sessionStorage.getItem("deepLinkAttempted")) {
            console.log("Deep link already attempted. Preventing infinite loop.");
            return;
        }

        sessionStorage.setItem("deepLinkAttempted", "true");

        if (isIOS) {
            window.location.href = deepLink;
            setTimeout(() => {
                window.location.href = appStoreURL;
            }, 2000);
        } else if (isAndroid) {
            window.location.href = `intent://RootNavView/OpportunityDetails?id=${opportunityId || ""}#Intent;scheme=capitalconnect;package=com.capital.connect.app;S.browser_fallback_url=${encodeURIComponent(playStoreURL)};end;`;
        } else {
            window.location.href = playStoreURL;
        }
    }

    // Fetch Metadata Dynamically Before Redirecting
    if (opportunityId) {
        fetch(`/api/meta?id=${opportunityId}`)
            .then(response => response.json())
            .then(data => {
                document.title = data.title;
                document.querySelector('meta[property="og:title"]').setAttribute("content", data.title);
                document.querySelector('meta[property="og:description"]').setAttribute("content", data.description);
                document.querySelector('meta[property="og:image"]').setAttribute("content", data.image);
                document.querySelector('meta[property="og:url"]').setAttribute("content", window.location.href);

                openAppOrRedirect(); // Redirect after metadata update
            })
            .catch(error => {
                console.error("Error fetching metadata:", error);
                openAppOrRedirect(); // Redirect even if metadata fetch fails
            });
    } else {
        openAppOrRedirect();
    }
});
