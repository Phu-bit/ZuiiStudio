import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";


export const metadata = {
  title: "Your Studio",
  description: "Design studio portfolio",
  metadataBase: new URL("https://your-domain.com")
};

export default function SiteLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen bg-emerald-600 text-white antialiased">
        <Header />
      <main className="mx-auto w-[95%] pb-24 pt-10">
        {children}
      </main>
        <Footer />
      </body>
    </html>
  );
}
