import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <title>Admin Panel</title>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
