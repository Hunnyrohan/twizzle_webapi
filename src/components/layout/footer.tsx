"use client";

export default function Footer() {
    return (
        <footer className="py-8 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-black">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center gap-6 mb-4">
                    <a href="#" className="hover:underline">About</a>
                    <a href="#" className="hover:underline">Help Center</a>
                    <a href="#" className="hover:underline">Terms of Service</a>
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Cookie Policy</a>
                    <a href="#" className="hover:underline">Accessibility</a>
                    <a href="#" className="hover:underline">Ads info</a>
                    <a href="#" className="hover:underline">Blog</a>
                </div>
                <p>&copy; {new Date().getFullYear()} Twizzle Corp.</p>
            </div>
        </footer>
    );
}
