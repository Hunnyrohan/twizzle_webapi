'use client';

import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    isCalling: boolean;
    callType: 'audio' | 'video';
    isIncomingCall: boolean;
    isAccepted: boolean;
    username: string;
    image: string | null;
    isVerified: boolean;
    isMuted: boolean;
    isCameraOff: boolean;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    initiateCall: (toUserId: string, otherUserName: string, type: 'audio' | 'video', conversationId?: string, isVerified?: boolean, otherUserImage?: string | null) => Promise<void>;
    acceptCall: () => Promise<void>;
    rejectCall: () => void;
    hangupCall: () => void;
    toggleMute: () => void;
    toggleCamera: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error('useSocket must be used within a SocketProvider');
    return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    // Call States
    const [isCalling, setIsCalling] = useState(false);
    const [callType, setCallType] = useState<'audio' | 'video'>('audio');
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [callerName, setCallerName] = useState<string>('');
    const [callerImage, setCallerImage] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [isAccepted, setIsAccepted] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
    const [callerId, setCallerId] = useState<string | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const peerRef = useRef<RTCPeerConnection | null>(null);
    const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
    const conversationIdRef = useRef<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const isMediaRequestingRef = useRef(false);
    const mediaPromiseRef = useRef<Promise<MediaStream> | null>(null);

    useEffect(() => {
        const s = io('http://localhost:5000');
        setSocket(s);
        return () => { s.close(); };
    }, []);

    useEffect(() => {
        const userId = user?.id || user?._id;
        if (socket && userId) {
            socket.emit('join', userId);
            console.log('Global socket join emitted for user:', userId, 'Socket ID:', socket.id);
        }
    }, [socket, user]);

    // 1. logCall
    const logCall = useCallback(async (status: 'missed' | 'ended', duration?: number) => {
        if (!conversationIdRef.current) return;
        try {
            const formData = new FormData();
            formData.append('type', 'call');
            formData.append('callData', JSON.stringify({ type: callType, status, duration }));

            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/messages/conversations/${conversationIdRef.current}/messages`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) console.log('Call logged successfully');
        } catch (err) {
            console.error('Log call error:', err);
        }
    }, [callType]);

    // 2. cleanupCall
    const cleanupCall = useCallback(() => {
        console.log('Cleaning up call state');
        if (streamRef.current) {
            console.log('Force stopping all tracks');
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                track.enabled = false;
            });
            streamRef.current = null;
        }
        if (peerRef.current) {
            console.log('Closing peer connection');
            peerRef.current.close();
            peerRef.current = null;
        }
        pendingCandidatesRef.current = [];
        setLocalStream(null);
        setRemoteStream(remote => {
            if (remote) remote.getTracks().forEach(track => track.stop());
            return null;
        });
        setIsCalling(false);
        setIsIncomingCall(false);
        setIsAccepted(false);
        setCallerId(null);
        startTimeRef.current = null;
        isMediaRequestingRef.current = false;
    }, []);

    // 3. createPeer
    // Helper for robust media access - Serialized with a promise queue
    const getMediaWithRetry = useCallback(async (constraints: MediaStreamConstraints, retries = 2, delay = 500): Promise<MediaStream> => {
        // Queue the request
        const currentPromise = mediaPromiseRef.current || Promise.resolve();

        const nextPromise = currentPromise.then(async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                return stream;
            } catch (err: any) {
                if (err.name === 'NotReadableError' && retries > 0) {
                    console.warn(`Media device busy, retrying in ${delay}ms... (${retries} retries left)`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return getMediaWithRetry(constraints, retries - 1, delay * 2);
                }
                throw err;
            }
        });

        mediaPromiseRef.current = nextPromise.catch(() => { }) as Promise<any>;
        return nextPromise;
    }, []);

    const createPeer = useCallback((targetUserId: string) => {
        if (peerRef.current) {
            console.log('Closing existing peer before creating new one');
            peerRef.current.close();
        }
        const p = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        p.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit('peer:ice:candidate', { to: targetUserId, candidate: event.candidate });
            }
        };

        p.oniceconnectionstatechange = () => {
            console.log('ICE Connection State changed:', p.iceConnectionState);
        };

        p.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
            if (!startTimeRef.current) startTimeRef.current = Date.now();
        };

        peerRef.current = p;
        return p;
    }, [socket]);

    // 4. initiateCall
    const initiateCall = useCallback(async (toUserId: string, otherUserName: string, type: 'audio' | 'video', convId?: string, isOtherVerified?: boolean, otherUserImage?: string | null) => {
        if (isMediaRequestingRef.current) return;
        isMediaRequestingRef.current = true;

        setCallType(type);
        setCallerName(otherUserName);
        setCallerImage(otherUserImage || null);
        setCallerId(toUserId);
        setIsVerified(!!isOtherVerified);
        setIsCalling(true);
        setIsIncomingCall(false);
        setIsAccepted(true);
        conversationIdRef.current = convId || null;
        startTimeRef.current = null;

        try {
            let stream = streamRef.current;
            const needsVideo = type === 'video';
            const hasVideo = (stream?.getVideoTracks().length ?? 0) > 0;

            // Warm Hardware: Reuse only if constraints are identical
            if (stream && stream.active && needsVideo === hasVideo) {
                console.log('Warm Hardware: Reusing existing compatible stream');
            } else {
                if (stream) {
                    console.log('Stopping old stream for fresh session (Constraint mismatch)');
                    stream.getTracks().forEach(track => {
                        track.enabled = false;
                        track.stop();
                    });
                    streamRef.current = null;
                    setLocalStream(null); // Clear state before delay

                    // Ultra-stable: 1500ms delay for Windows hardware drivers
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
                stream = await getMediaWithRetry({
                    audio: true,
                    video: type === 'video'
                });

                // Race condition check: Did the user hang up while we were waiting?
                if (!isMediaRequestingRef.current) {
                    console.log('Media obtained but request was aborted');
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }
            }

            setLocalStream(stream);
            streamRef.current = stream;

            const p = createPeer(toUserId);
            stream.getTracks().forEach(track => {
                track.enabled = true;
                p.addTrack(track, stream!);
            });

            const offer = await p.createOffer();
            await p.setLocalDescription(offer);

            socket?.emit('call:user', {
                to: toUserId,
                offer,
                callType: type,
                callerName: user?.name,
                callerImage: user?.image,
                isVerified: !!user?.isVerified,
                conversationId: convId
            });
        } catch (err: any) {
            console.error('Init call error:', err);
            // Silent failure if we already have a stream or if it's a transient busyness
            if (err.name === 'NotReadableError' && !streamRef.current) {
                console.error('Fatal media error: Device in use and no backup stream available.');
            }
            cleanupCall();
        } finally {
            isMediaRequestingRef.current = false;
        }
    }, [user, socket, createPeer, cleanupCall, getMediaWithRetry]);

    // 5. handleIncomingCall
    const handleIncomingCall = useCallback(async ({ from, offer, callType: incomingType, callerName: incomingName, callerImage: incomingImage, isVerified: incomingVerified, conversationId }: any) => {
        setIsIncomingCall(true);
        setIsCalling(true);
        setCallerId(from);
        setCallerName(incomingName || 'Unknown User');
        setCallerImage(incomingImage || null);
        setIsVerified(!!incomingVerified);
        setCallType(incomingType);
        setIsAccepted(false);
        conversationIdRef.current = conversationId || null;
        startTimeRef.current = null;

        try {
            const p = createPeer(from);
            await p.setRemoteDescription(new RTCSessionDescription(offer));
            while (pendingCandidatesRef.current.length > 0) {
                const candidate = pendingCandidatesRef.current.shift();
                if (candidate) await p.addIceCandidate(new RTCIceCandidate(candidate));
            }
        } catch (err) {
            cleanupCall();
        }
    }, [createPeer, cleanupCall]);

    // 6. handleCallAccepted
    const handleCallAccepted = useCallback(async ({ ans }: any) => {
        try {
            if (peerRef.current) {
                await peerRef.current.setRemoteDescription(new RTCSessionDescription(ans));
                startTimeRef.current = Date.now();
                while (pendingCandidatesRef.current.length > 0) {
                    const candidate = pendingCandidatesRef.current.shift();
                    if (candidate) await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            }
        } catch (err) {
            console.error('Handle call accepted error:', err);
        }
    }, []);

    // 7. handleIceCandidate
    const handleIceCandidate = useCallback(async ({ candidate }: any) => {
        if (!candidate) return;
        try {
            if (peerRef.current && peerRef.current.remoteDescription) {
                await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
                pendingCandidatesRef.current.push(candidate);
            }
        } catch (err) {
            console.error('Add Ice Candidate error:', err);
        }
    }, []);

    // 8. hangupCall
    const hangupCall = useCallback(() => {
        const to = callerId || '';
        const duration = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0;
        if (to) {
            socket?.emit('call:rejected', { to });
            if (startTimeRef.current) logCall('ended', duration);
        }
        cleanupCall();
        conversationIdRef.current = null;
    }, [socket, callerId, cleanupCall, logCall]);

    // 9. acceptCall
    const acceptCall = useCallback(async () => {
        if (!callerId || isMediaRequestingRef.current) return;
        isMediaRequestingRef.current = true;

        setIsIncomingCall(false);
        setIsAccepted(true);
        startTimeRef.current = Date.now();
        try {
            let stream = streamRef.current;
            const needsVideo = callType === 'video';
            const hasVideo = (stream?.getVideoTracks().length ?? 0) > 0;

            // Warm Hardware: Reuse only if constraints are identical
            if (stream && stream.active && needsVideo === hasVideo) {
                console.log('Warm Hardware: Reusing existing compatible stream for acceptance');
            } else {
                if (stream) {
                    console.log('Stopping old stream before fresh acceptance (Constraint mismatch)');
                    stream.getTracks().forEach(track => {
                        track.enabled = false;
                        track.stop();
                    });
                    streamRef.current = null;
                    setLocalStream(null); // Clear state before delay

                    // Ultra-stable: 1500ms delay for Windows hardware drivers
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
                stream = await getMediaWithRetry({
                    audio: true,
                    video: callType === 'video'
                });

                // Race condition check: Did the user hang up while we were waiting?
                if (!isMediaRequestingRef.current) {
                    console.log('Media obtained but acceptance was aborted');
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }
            }

            setLocalStream(stream);
            streamRef.current = stream;

            if (peerRef.current) {
                stream.getTracks().forEach(track => {
                    track.enabled = true;
                    peerRef.current?.addTrack(track, stream!);
                });
                const ans = await peerRef.current.createAnswer();
                await peerRef.current.setLocalDescription(ans);
                socket?.emit('call:accepted', { to: callerId, ans });
                while (pendingCandidatesRef.current.length > 0) {
                    const candidate = pendingCandidatesRef.current.shift();
                    if (candidate) await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            }
        } catch (err: any) {
            console.error('Accept call error:', err);
            // Silent failure if we already have a stream
            if (err.name === 'NotReadableError' && !streamRef.current) {
                console.error('Fatal accept error: Device in use and no backup stream available.');
            }
            hangupCall();
        } finally {
            isMediaRequestingRef.current = false;
        }
    }, [callerId, callType, socket, hangupCall]);

    // 10. rejectCall
    const rejectCall = useCallback(() => {
        const to = callerId || '';
        if (to) {
            socket?.emit('call:rejected', { to });
            logCall('missed');
        }
        cleanupCall();
        conversationIdRef.current = null;
    }, [socket, callerId, cleanupCall, logCall]);

    // 11. handleCallRejected
    const handleCallRejected = useCallback(() => {
        if (isIncomingCall && !startTimeRef.current) {
            logCall('missed');
        }
        cleanupCall();
        conversationIdRef.current = null;
    }, [cleanupCall, logCall, isIncomingCall]);

    // 12. toggleMute/Camera
    const toggleMute = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    }, [localStream]);

    const toggleCamera = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCameraOff(!videoTrack.enabled);
            }
        }
    }, [localStream]);

    useEffect(() => {
        if (!socket) return;
        socket.on('incomming:call', handleIncomingCall);
        socket.on('call:accepted', handleCallAccepted);
        socket.on('call:rejected', handleCallRejected);
        socket.on('peer:ice:candidate', handleIceCandidate);

        const handleUnload = () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                    track.stop();
                    track.enabled = false;
                });
            }
        };
        window.addEventListener('beforeunload', handleUnload);

        return () => {
            socket.off('incomming:call', handleIncomingCall);
            socket.off('call:accepted', handleCallAccepted);
            socket.off('call:rejected', handleCallRejected);
            socket.off('peer:ice:candidate', handleIceCandidate);
            window.removeEventListener('beforeunload', handleUnload);
            // Global cleanup on unmount
            handleUnload();
        };
    }, [socket, handleIncomingCall, handleCallAccepted, handleCallRejected, handleIceCandidate]);

    return (
        <SocketContext.Provider value={{
            socket, isCalling, callType, isIncomingCall, isAccepted,
            username: callerName, image: callerImage, isVerified, isMuted, isCameraOff,
            localStream, remoteStream, initiateCall, acceptCall, rejectCall,
            hangupCall, toggleMute, toggleCamera
        }}>
            {children}
        </SocketContext.Provider>
    );
};
