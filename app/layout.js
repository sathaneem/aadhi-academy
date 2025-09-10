import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "AADHI Project",
  description: "Learning project with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Navbar at the top */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-grow">{children}</main>

        {/* Footer at the bottom */}
        <Footer />
      </body>
    </html>
  );
}
