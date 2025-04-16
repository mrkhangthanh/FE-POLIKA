import React, { useState, useEffect } from 'react';
import { getCategoryService, createCategoryService, updateCategoryService, deleteCategoryService } from '../../../services/Api';
import { toast } from 'react-toastify';
import './ServiceCategories.css';

const ServiceCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ value: '', label: '', isActive: true }); // Thêm isActive vào formData
  const [editCategoryId, setEditCategoryId] = useState(null);

  // Lấy danh sách danh mục dịch vụ từ API
  const fetchCategories = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getCategoryService();
      console.log('API Response:', response);

      const serviceTypes = Array.isArray(response.data.service_types) ? response.data.service_types : [];
      const mappedCategories = serviceTypes.map((category) => ({
        id: category._id,
        name: category.label,
        value: category.value,
        label: category.label,
        isActive: category.isActive,
      }));

      console.log('Mapped Categories:', mappedCategories);
      setCategories(mappedCategories);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Không thể tải danh sách danh mục dịch vụ.';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Xử lý thêm hoặc cập nhật danh mục
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const categoryData = {
        value: formData.value,
        label: formData.label,
        isActive: formData.isActive, // Sử dụng giá trị isActive từ form
      };

      if (editCategoryId) {
        // Cập nhật danh mục
        await updateCategoryService(editCategoryId, categoryData);
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editCategoryId
              ? { ...cat, value: formData.value, name: formData.label, label: formData.label, isActive: formData.isActive }
              : cat
          )
        );
        toast.success('Cập nhật danh mục thành công!');
      } else {
        // Thêm danh mục mới
        const response = await createCategoryService(categoryData);
        const newCategory = {
          id: response._id,
          name: response.label,
          value: response.value,
          label: response.label,
          isActive: response.isActive,
        };
        setCategories((prev) => [...prev, newCategory]);
        toast.success('Thêm danh mục thành công!');
      }
      setShowForm(false);
      setFormData({ value: '', label: '', isActive: true });
      setEditCategoryId(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Không thể lưu danh mục.';
      setError(errorMessage);
      console.error('Error saving category:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý chỉnh sửa danh mục
  const handleEdit = (category) => {
    setFormData({
      value: category.value,
      label: category.label,
      isActive: category.isActive, // Điền giá trị isActive vào form
    });
    setEditCategoryId(category.id);
    setShowForm(true);
  };

  // Xử lý xóa danh mục
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      setIsLoading(true);
      try {
        await deleteCategoryService(id);
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        toast.success('Xóa danh mục thành công!');
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Không thể xóa danh mục.';
        setError(errorMessage);
        console.error('Error deleting category:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="service-categories">
      <h3>Danh mục dịch vụ</h3>
      {error && <p className="error-message">{error}</p>}
      {isLoading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setFormData({ value: '', label: '', isActive: true });
              setEditCategoryId(null);
            }}
            className="add-button"
          >
            {showForm ? 'Ẩn form' : 'Thêm danh mục'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="category-form">
              <div>
                <label htmlFor="value">Giá trị (Value):</label>
                <input
                  type="text"
                  id="value"
                  placeholder="Nhập giá trị (VD: DienNuoc)"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="label">Tên danh mục (Label):</label>
                <input
                  type="text"
                  id="label"
                  placeholder="Nhập tên danh mục (VD: Điện nước)"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="isActive">Trạng thái:</label>
                <select
                  id="isActive"
                  value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                >
                  <option value="true">Active</option>
                  <option value="false">Deactive</option>
                </select>
              </div>
              <button type="submit" className="save-button">
                {editCategoryId ? 'Cập nhật' : 'Thêm'}
              </button>
            </form>
          )}

          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Giá trị (Value)</th> {/* Thêm cột Value */}
                <th>Tên dịch vụ</th>
                <th>Trạng thái</th> {/* Thêm cột Trạng thái */}
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.value}</td> {/* Hiển thị value */}
                    <td>{category.name}</td>
                    <td>{category.isActive ? 'Active' : 'Deactive'}</td> {/* Hiển thị trạng thái */}
                    <td>
                      <button onClick={() => handleEdit(category)} className="edit-button">
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="delete-button">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Không có danh mục nào để hiển thị.</td> {/* Cập nhật colSpan thành 5 */}
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ServiceCategories;