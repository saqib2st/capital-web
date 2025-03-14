import { useEffect } from "react";
import { useRouter } from "next/router";

const appStoreURL = "https://apps.apple.com/app/6742452533";
const playStoreURL =
  "https://play.google.com/store/apps/details?id=com.capital.connect.app";

export default function RedirectPage() {
  const router = useRouter();
  const { slug, ...query } = router.query;

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const androidAppScheme = `capitalconnect://RootNavView/${slug}?${new URLSearchParams(
      query
    ).toString()}`;
    const iosAppScheme = `capitalconnect://RootNavView/${slug}?${new URLSearchParams(
      query
    ).toString()}`;

    if (isMobile) {
      setTimeout(() => {
        window.location.href = /iPhone|iPad|iPod/i.test(navigator.userAgent)
          ? iosAppScheme
          : androidAppScheme;
      }, 100);

      setTimeout(() => {
        window.location.href = /iPhone|iPad|iPod/i.test(navigator.userAgent)
          ? appStoreURL
          : playStoreURL;
      }, 2000);
    } else {
      window.location.href = playStoreURL;
    }
  }, [slug, query]);

  return <h1>Redirecting...</h1>;
}
