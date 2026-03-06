// Safely get the backend base URL (handles both SSR and client-side)
function getBackendBase(): string {
    if (typeof window === 'undefined') {
        // During SSR, use localhost — this URL will be replaced on the client
        return 'http://localhost:5000';
    }
    return `${window.location.protocol}//${window.location.hostname}:5000`;
}

/**
 * Resolves an image path to a full URL.
 * Handles:
 * 1. Absolute URLs (http/https) - returns as is
 * 2. Uploads paths (uploads/filename or /uploads/filename) - prepends backend base
 * 3. Relative paths - prepends backend base
 * 4. Empty/null paths - returns empty string
 */
export const resolveImageUrl = (path: string | undefined | null): string => {
    if (!path) return '';

    // Already a full URL (Google profile pic, etc.) or a preview URL (blob/data)
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;

    const base = getBackendBase();

    // Normalize path: replace backslashes and remove leading slash
    let cleanPath = path.replace(/\\/g, '/');
    if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
    }

    // Ensure spaces are encoded
    const encodedPath = encodeURI(cleanPath);

    if (encodedPath.startsWith('uploads/')) {
        return `${base}/${encodedPath}`;
    }

    // Default to assuming it's an upload if it's just a filename
    return `${base}/uploads/${encodedPath}`;
};
