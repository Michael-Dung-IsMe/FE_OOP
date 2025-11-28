import axiosClient from './axiosClient';
import { Expense, ExpenseRequest, ExpenseParams } from '../types/Expense';

const transactionApi = {
  // 1. Lấy danh sách (Bao gồm cả Lọc, Tìm kiếm, Phân trang, Sắp xếp)
  // GET /expenses?page=1&limit=10&categoryId=2&sort=date:desc
    getAll: (params?: ExpenseParams): Promise<Expense[]> => {
        const url = '/expenses';
        // axios sẽ tự động chuyển object 'params' thành query string trên URL
        return axiosClient.get(url, { params }); 
    },

  // 2. Lấy chi tiết 1 giao dịch (nếu cần sửa)
  // GET /expenses/1
    getById: (id: number): Promise<Expense> => {
        const url = `/expenses/${id}`;
        return axiosClient.get(url);
    },

  // 3. Tạo mới
  // POST /expenses
    create: (data: ExpenseRequest): Promise<Expense> => {
        const url = '/expenses';
        return axiosClient.post(url, data);
    },

  // 4. Cập nhật (Sửa)
  // PUT /expenses/1
    update: (id: number, data: ExpenseRequest): Promise<Expense> => {
        const url = `/expenses/${id}`;
        return axiosClient.put(url, data);
    },

  // 5. Xóa
  // DELETE /expenses/1
    delete: (id: number): Promise<any> => {
        const url = `/expenses/${id}`;
        return axiosClient.delete(url);
    }
};

export default transactionApi;