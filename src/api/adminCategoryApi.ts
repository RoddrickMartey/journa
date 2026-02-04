import { api } from "@/lib/axios";

const ADMIN_CATEGORY_API = "/category";

export const fetchCategories = async () => {
  const response = await api.get(`${ADMIN_CATEGORY_API}`);
  return response.data;
};
export const createCategory = async (categoryData: {
  name: string;
  description?: string;
  colorLight: string;
  colorDark: string;
}) => {
  const response = await api.post(`${ADMIN_CATEGORY_API}`, categoryData);
  return response.data;
};
export const updateCategory = async (
  categoryId: string,
  categoryData: {
    name: string;
    description?: string;
    colorLight: string;
    colorDark: string;
  },
) => {
  const response = await api.put(
    `${ADMIN_CATEGORY_API}/${categoryId}`,
    categoryData,
  );
  return response.data;
};
export const deleteCategory = async (categoryId: string) => {
  const response = await api.delete(`${ADMIN_CATEGORY_API}/${categoryId}`);
  return response.data;
};
