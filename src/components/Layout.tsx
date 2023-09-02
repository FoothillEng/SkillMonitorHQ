import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen justify-between bg-gradient-radial from-blue-950 to-black">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
