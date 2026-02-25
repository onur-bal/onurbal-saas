export const metadata = {
  title: "Onur Bal",
  description: "Blog + SaaS platformu"
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body style={{ fontFamily: "system-ui", margin: 0, padding: 24 }}>
        {children}
      </body>
    </html>
  );
}
