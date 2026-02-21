'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import Footer from './footer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Routes that should NOT have Navbar and Footer (App Routes)
    const isAppRoute =
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/settings') ||
        pathname?.startsWith('/messages') ||
        pathname?.startsWith('/explore') ||
        pathname?.startsWith('/profile') ||
        pathname?.startsWith('/notifications') ||
        pathname?.startsWith('/bookmarks');

    const isAuthRoute = pathname?.startsWith('/login') || pathname?.startsWith('/signup');

    // For app and auth pages, render children without Navbar/Footer
    if (isAppRoute || isAuthRoute) {
        return <>{children}</>;
    }

    // For all other routes, render with Navbar and Footer
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
