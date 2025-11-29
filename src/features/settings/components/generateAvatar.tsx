// utils/avatarGenerator.ts

// Tạo màu ngẫu nhiên RGB
const generateRandomColor = (): string => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Lấy chữ cái đầu từ tên đầy đủ
 * VD: "Nguyen Tam" -> "NT"
 */
const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 0) return '?';
    if (names.length === 1) return names[0][0].toUpperCase();
    
    const firstInitial = names[0][0];
    const lastInitial = names[names.length - 1][0];
    return (firstInitial + lastInitial).toUpperCase();
};

/**
 * Tạo avatar SVG với chữ cái và màu ngẫu nhiên
 */
export const generateAvatarSVG = (fullName: string): string => {
    const initials = getInitials(fullName);
    const backgroundColor = generateRandomColor();
    
    // Tính toán màu chữ dựa trên độ sáng của background
    const rgb = backgroundColor.match(/\d+/g);
    if (!rgb) return '';
    
    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
    const textColor = brightness > 128 ? '#000000' : '#FFFFFF';
    
    const svg = `
        <svg width="90" height="90" xmlns="http://www.w3.org/2000/svg">
            <rect width="90" height="90" fill="${backgroundColor}" rx="45"/>
            <text
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
                font-family="Arial, sans-serif"
                font-size="36"
                font-weight="bold"
                fill="${textColor}"
            >
                ${initials}
            </text>
        </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Tạo và lưu avatar vào localStorage
 */
export const generateAndSaveAvatar = (fullName: string, userId: number): string => {
    const avatarData = generateAvatarSVG(fullName);
    const storageKey = `user_avatar_${userId}`;
    
    localStorage.setItem(storageKey, avatarData);
    localStorage.setItem(`${storageKey}_timestamp`, Date.now().toString());
    
    return avatarData;
};

/**
 * Lấy avatar từ localStorage hoặc tạo mới
 */
export const getOrCreateAvatar = (fullName: string, userId: number): string => {
    const storageKey = `user_avatar_${userId}`;
    const savedAvatar = localStorage.getItem(storageKey);
    
    if (savedAvatar) {
        return savedAvatar;
    }
    
    return generateAndSaveAvatar(fullName, userId);
};

/**
 * Force tạo avatar mới (khi user muốn đổi avatar)
 */
export const regenerateAvatar = (fullName: string, userId: number): string => {
  return generateAndSaveAvatar(fullName, userId);
};

export default {
    generateAvatarSVG,
    generateAndSaveAvatar,
    getOrCreateAvatar,
    regenerateAvatar
};