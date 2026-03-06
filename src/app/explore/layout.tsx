import { Sidebar } from "@/components/dashboard/Sidebar";
import { RightPanel } from "@/components/dashboard/RightPanel";

export default function ExploreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <div className="flex w-full max-w-[1300px]">
                {/* Left Sidebar - Fixed width */}
                <header className="sticky top-0 h-screen w-[80px] xl:w-[275px] flex-shrink-0 hidden sm:flex flex-col border-r border-gray-200 dark:border-gray-800 items-end xl:items-start">
                    <Sidebar />
                </header>

                {/* Main Content - Scrollable */}
                <main className="flex-1 min-w-0 border-r border-gray-200 dark:border-gray-800">
                    {children}
                </main>

                {/* Right Sidebar - Hidden on mobile/tablet */}
                <aside className="sticky top-0 h-screen w-[350px] flex-shrink-0 hidden lg:block border-l border-gray-200 dark:border-gray-800">
                    <RightPanel />
                </aside>
            </div>
        </div>
    );
}
