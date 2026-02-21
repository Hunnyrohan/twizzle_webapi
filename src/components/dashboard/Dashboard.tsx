'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';
import { Feed } from './Feed';

const Dashboard = () => {
    // Mock user for sidebar
    const user = {
        name: 'John Doe',
        username: 'johndoe'
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans box-border">
            <div className="container mx-auto max-w-7xl flex">
                {/* Left Sidebar */}
                <Sidebar user={user} />

                {/* Center Feed */}
                <main className="flex-1 max-w-2xl w-full">
                    <Feed />
                </main>

                {/* Right Panel */}
                <RightPanel />
            </div>
        </div>
    );
};

export default Dashboard;
