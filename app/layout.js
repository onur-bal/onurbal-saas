export const metadata = {
  title: "Onur Bal",
  description: "Blog + SaaS platformu",
  manifest: "/manifest.webmanifest",
  themeColor: "#ffffff",
  appleWebApp: {
  capable: true,
  title: "Onur Bal",
  statusBarStyle: "default",
},
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/icon-192.png" }]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body style={{ fontFamily: "system-ui", margin: 0 }}>
        <header style={{ borderBottom: "1px solid #eee", padding: "12px 16px" }}>
          <nav style={{ display: "flex", gap: 12 }}>
            <a href="/" style={{ textDecoration: "none" }}>Ana Sayfa</a>
            <a href="/blog" style={{ textDecoration: "none" }}>Blog</a>
            <a href="/dashboard" style={{ textDecoration: "none" }}>Dashboard</a>
            <a href="/login" style={{ textDecoration: "none" }}>Login</a>
          </nav>
        </header>

        <div style={{ padding: 24 }}>{children}</div>
      </body>
    </html>
  );
}
