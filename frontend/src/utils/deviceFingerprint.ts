/**
 * Device Fingerprint Utility
 * Tạo một fingerprint duy nhất dựa trên thông tin browser và device
 */

interface DeviceInfo {
    userAgent: string;
    ipAddress?: string;
    deviceFingerprint: string;
}

/**
 * Tạo device fingerprint từ các thông tin có sẵn của browser
 */
export const generateDeviceFingerprint = (): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Canvas fingerprinting
    let canvasFingerprint = '';
    if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Device Fingerprint Test 🔒', 2, 2);
        canvasFingerprint = canvas.toDataURL();
    }

    // Collect various browser properties
    const fingerprints = [
        navigator.userAgent,
        navigator.language,
        navigator.languages?.join(','),
        window.screen.width + 'x' + window.screen.height,
        window.screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.platform,
        navigator.cookieEnabled,
        navigator.doNotTrack,
        navigator.maxTouchPoints,
        canvasFingerprint.slice(0, 100), // First 100 chars of canvas
    ];

    // WebGL fingerprinting
    try {
        const gl = canvas.getContext('webgl') as WebGLRenderingContext | null ||
            canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                fingerprints.push(
                    gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                    gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                );
            }
        }
    } catch (e) {
        // WebGL not available
    }

    // Create hash from collected fingerprints
    const combined = fingerprints.filter(Boolean).join('|');
    return 'fp_' + btoa(combined).replace(/[+/=]/g, '').substring(0, 32);
};

/**
 * Lấy IP address của client (thông qua external API hoặc WebRTC)
 */
export const getClientIPAddress = async (): Promise<string | null> => {
    try {
        // Method 1: Try WebRTC STUN servers
        const rtcIp = await getIPFromWebRTC();
        if (rtcIp && rtcIp !== '0.0.0.0') {
            return rtcIp;
        }

        // Method 2: Fallback to external API
        const response = await fetch('https://api.ipify.org?format=json', {
            timeout: 3000,
        } as RequestInit);

        if (response.ok) {
            const data = await response.json();
            return data.ip;
        }
    } catch (error) {
        console.warn('Could not determine client IP:', error);
    }

    return null;
};

/**
 * Lấy IP từ WebRTC STUN servers
 */
const getIPFromWebRTC = (): Promise<string | null> => {
    return new Promise((resolve) => {
        try {
            const rtc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            });

            let resolved = false;

            rtc.onicecandidate = (event) => {
                if (event.candidate && !resolved) {
                    const candidate = event.candidate.candidate;
                    const match = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
                    if (match && match[1]) {
                        resolved = true;
                        resolve(match[1]);
                        rtc.close();
                    }
                }
            };

            // Create data channel to trigger ICE gathering
            rtc.createDataChannel('test');
            rtc.createOffer()
                .then(offer => rtc.setLocalDescription(offer))
                .catch(() => resolve(null));

            // Timeout after 3 seconds
            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(null);
                    rtc.close();
                }
            }, 3000);

        } catch (error) {
            resolve(null);
        }
    });
};

/**
 * Thu thập tất cả thông tin device để gửi lên server
 */
export const collectDeviceInfo = async (): Promise<DeviceInfo> => {
    const userAgent = navigator.userAgent;
    const deviceFingerprint = generateDeviceFingerprint();

    // Try to get IP address (non-blocking)
    let ipAddress: string | undefined;
    try {
        ipAddress = (await getClientIPAddress()) || undefined;
    } catch (error) {
        // IP detection failed, continue without it
        console.warn('IP detection failed:', error);
    }

    return {
        userAgent,
        ipAddress,
        deviceFingerprint,
    };
};

/**
 * Kiểm tra xem device fingerprint có khả dụng không
 */
export const isDeviceFingerprintSupported = (): boolean => {
    return typeof window !== 'undefined' &&
        typeof document !== 'undefined' &&
        typeof navigator !== 'undefined';
};