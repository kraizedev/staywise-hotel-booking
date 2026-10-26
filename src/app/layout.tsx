import Link from "next/link";
import "./globals.css";

const hotel = process.env.HOTEL_NAME || "Your Hotel";
export const metadata = { title: hotel, description: `Book your stay at ${hotel}` };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">{hotel}</Link>
          <nav><Link href="/rooms">Rooms</Link></nav>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">© {new Date().getFullYear()} {hotel}</footer>
      </body>
    </html>
  );
}
