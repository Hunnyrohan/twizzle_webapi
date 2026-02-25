'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import Footer from './footer';
import { useSocket } from '@/context/SocketContext';
import { CallModal } from '../messages/CallModal';
import { PostModal } from '../dashboard/PostModal';
import { useModal } from '@/context/ModalContext';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const {
        isCalling,
        callType,
        isIncomingCall,
        isAccepted,
        username,
        image,
        isVerified,
        isMuted,
        isCameraOff,
        localStream,
        remoteStream,
        acceptCall,
        rejectCall,
        hangupCall,
        toggleMute,
        toggleCamera
    } = useSocket();
    const { isPostModalOpen, closePostModal } = useModal();

    // Debugging logs
    useEffect(() => {
        if (isCalling) {
            console.log('LayoutWrapper: isCalling changed:', { isCalling, isIncomingCall, username, callType });
        }
    }, [isCalling, isIncomingCall, username, callType]);

    // Routes that should NOT have Navbar and Footer (App Routes)
    const isAppRoute =
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/settings') ||
        pathname?.startsWith('/messages') ||
        pathname?.startsWith('/explore') ||
        pathname?.startsWith('/profile') ||
        pathname?.startsWith('/notifications') ||
        pathname?.startsWith('/post') ||
        pathname?.startsWith('/bookmarks');

    const isAuthRoute = pathname?.startsWith('/login') || pathname?.startsWith('/signup');

    return (
        <>
            {!isAppRoute && !isAuthRoute && <Navbar />}
            {children}
            {!isAppRoute && !isAuthRoute && <Footer />}

            {isCalling && (
                <CallModal
                    type={callType}
                    isIncoming={isIncomingCall}
                    isAccepted={isAccepted}
                    callerName={username}
                    callerImage={image}
                    isVerified={isVerified}
                    isMuted={isMuted}
                    isCameraOff={isCameraOff}
                    onAccept={acceptCall}
                    onDecline={rejectCall}
                    onHangup={hangupCall}
                    onToggleMute={toggleMute}
                    onToggleCamera={toggleCamera}
                    localStream={localStream}
                    remoteStream={remoteStream}
                />
            )}

            <PostModal
                isOpen={isPostModalOpen}
                onClose={closePostModal}
            />
        </>
    );
}
