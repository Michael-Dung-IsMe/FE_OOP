// Category Interface (Dựa trên bảng categories)
export type CategoryType = 'Chi tiêu' | 'Thu nhập'; // Định nghĩa type cứng cho an toàn

export interface Category {
    categoryId: number;
    name: string;
    type: CategoryType;
}