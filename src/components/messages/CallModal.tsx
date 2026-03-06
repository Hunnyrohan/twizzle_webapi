'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import VerifiedBadge from '../common/VerifiedBadge';
import { resolveImageUrl } from '@/lib/media-utils';

interface CallModalProps {
    type: 'audio' | 'video';
    isIncoming: boolean;
    isAccepted: boolean;
    callerName: string;
    callerImage: string | null;
    isVerified: boolean;
    isMuted: boolean;
    isCameraOff: boolean;
    onAccept: () => void;
    onDecline: () => void;
    onHangup: () => void;
    onToggleMute: () => void;
    onToggleCamera: () => void;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
}

export const CallModal: React.FC<CallModalProps> = ({
    type,
    isIncoming,
    isAccepted,
    callerName,
    callerImage,
    isVerified,
    isMuted,
    isCameraOff,
    onAccept,
    onDecline,
    onHangup,
    onToggleMute,
    onToggleCamera,
    localStream,
    remoteStream
}) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
        return () => {
            if (localVideoRef.current) localVideoRef.current.srcObject = null;
        };
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
        return () => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        };
    }, [remoteStream]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="bg-gray-900 w-full max-w-2xl aspect-video rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
                {/* Remote Video (Main) */}
                <div className="flex-1 bg-gray-800 relative flex items-center justify-center text-center">
                    {type === 'video' && remoteStream && isAccepted && !isCameraOff ? (
                        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center p-8">
                            <div className="relative mb-6">
                                {callerImage ? (
                                    <img
                                        src={resolveImageUrl(callerImage)}
                                        alt={callerName}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500/30 shadow-2xl"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                                        {callerName?.[0] || '?'}
                                    </div>
                                )}
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center border-2 border-gray-800">
                                    {type === 'video' ? <Video size={18} className="text-blue-400" /> : <Phone size={18} className="text-blue-400" />}
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center gap-2">
                                {callerName}
                                {isVerified && <VerifiedBadge size={24} />}
                            </h2>
                            <p className="text-blue-400 font-medium animate-pulse tracking-wide uppercase text-xs">
                                {isIncoming && !isAccepted ? 'Incoming call...' : (isMuted ? 'Muted' : 'In call...')}
                            </p>
                        </div>
                    )}

                    {/* Local Video (Small Overlay) */}
                    {type === 'video' && localStream && isAccepted && (
                        <div className="absolute top-4 right-4 w-44 aspect-video bg-black rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl group">
                            <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover transition-opacity ${isCameraOff ? 'opacity-0' : 'opacity-100'}`} />
                            {isCameraOff && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                    <VideoOff size={24} className="text-gray-500" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="bg-gray-800/80 backdrop-blur-2xl p-8 border-t border-white/5">
                    <div className="flex items-center justify-center gap-8">
                        {isIncoming && !isAccepted ? (
                            <>
                                <button
                                    onClick={onAccept}
                                    className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-full shadow-xl shadow-green-500/20 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group"
                                >
                                    <Phone size={32} className="group-hover:animate-bounce" />
                                </button>
                                <button
                                    onClick={onDecline}
                                    className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-full shadow-xl shadow-red-500/20 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group"
                                >
                                    <PhoneOff size={32} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onToggleMute}
                                    className={`p-5 rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg flex items-center justify-center ${isMuted ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-gray-700 hover:bg-gray-600 text-white'
                                        }`}
                                >
                                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                                </button>

                                {type === 'video' && (
                                    <button
                                        onClick={onToggleCamera}
                                        className={`p-5 rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg flex items-center justify-center ${isCameraOff ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-gray-700 hover:bg-gray-600 text-white'
                                            }`}
                                    >
                                        {isCameraOff ? <VideoOff size={24} /> : <Video size={24} />}
                                    </button>
                                )}

                                <button
                                    onClick={onHangup}
                                    className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-full shadow-xl shadow-red-500/20 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group"
                                >
                                    <PhoneOff size={32} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
