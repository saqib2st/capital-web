export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Welcome to Capital Connect</h1>
      <p>Download the app for the best experience.</p>
      <div style={{ marginTop: "20px" }}>
        <a
          href="https://play.google.com/store/apps/details?id=com.capital.connect.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", marginRight: "20px" }}
        >
          <img
            src="/android-download.png"
            alt="Download Android"
            width="200px"
          />
        </a>
        <a
          href="https://apps.apple.com/app/6742452533"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/ios-download.png" alt="Download iOS" width="200px" />
        </a>
      </div>
    </div>
  );
}
