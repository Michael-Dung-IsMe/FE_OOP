// User Interface (Dựa trên bảng users)
export interface User {
    userId: number;
    email: string;
    fullName: string;
    passwordHash?: string; // Thường không nên trả về FE, nhưng khai báo optional nếu cần
    createdAt: string;
}