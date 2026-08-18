import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#e8ebe6] text-[#0e0f0c]">
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}