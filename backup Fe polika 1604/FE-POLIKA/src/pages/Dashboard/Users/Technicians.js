import React, { useState, useEffect } from 'react';
import { getCategoryService, updateUser } from '../../../services/Api';
import RenderPagination from '../../../share/components/Pagination/renderPagination'; // Import component RenderPagination
import './Technicians.css';

const Technicians = ({ users }) => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredService, setFilteredService] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State cho tìm kiếm
  const [technicians, setTechnicians] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [updateError, setUpdateError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const techniciansPerPage = 10; // Số thợ mỗi trang

  // Lấy danh sách service_types từ API
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        setLoading(true);
        const response = await getCategoryService();
        const serviceTypesData = Array.isArray(response.data.service_types)
          ? response.data.service_types
          : [];
        setServiceTypes(serviceTypesData);
      } catch (err) {
        console.error('Error fetching service types:', err);
        setError('Không thể tải danh sách ngành nghề.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceTypes();
  }, []);

  // Cập nhật danh sách thợ khi users, filteredService, hoặc searchQuery thay đổi
  useEffect(() => {
    let filteredTechnicians = users.filter((u) => u.role === 'technician');

    // Lọc theo ngành nghề
    if (filteredService) {
      filteredTechnicians = filteredTechnicians.filter((technician) =>
        technician.services.includes(filteredService)
      );
    }

    // Lọc theo tên hoặc email
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTechnicians = filteredTechnicians.filter(
        (technician) =>
          (technician.name && technician.name.toLowerCase().includes(query)) ||
          (technician.email && technician.email.toLowerCase().includes(query))
      );
    }

    setTechnicians(filteredTechnicians);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  }, [users, filteredService, searchQuery]);

  // Ánh xạ services với service_types để lấy tên ngành nghề
  const getSpecializations = (services) => {
    if (!services || services.length === 0) {
      return 'N/A';
    }

    const specializationNames = services
      .map((serviceId) => {
        const service = serviceTypes.find((type) => type._id === serviceId);
        return service ? service.label : null;
      })
      .filter((name) => name !== null);

    return specializationNames.length > 0 ? specializationNames.join(', ') : 'N/A';
  };

  // Xử lý thay đổi ngành nghề trong dropdown lọc
  const handleFilterChange = (e) => {
    setFilteredService(e.target.value);
  };

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Xử lý khi nhấn nút "Chỉnh sửa"
  const handleEditClick = (technician) => {
    setSelectedTechnician(technician);
    setSelectedServices(technician.services || []);
    setShowModal(true);
    setUpdateError('');
    setUpdateMessage('');
  };

  // Xử lý khi chọn ngành nghề trong modal
  const handleServiceChange = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Xử lý khi nhấn "Cập nhật" trong modal
  const handleUpdateServices = async () => {
    if (!selectedTechnician) return;

    try {
      const updatedData = {
        services: selectedServices,
      };

      await updateUser(selectedTechnician._id, updatedData);

      setTechnicians((prevTechnicians) =>
        prevTechnicians.map((tech) =>
          tech._id === selectedTechnician._id
            ? { ...tech, services: selectedServices }
            : tech
        )
      );

      setUpdateMessage('Cập nhật ngành nghề thành công!');
      setTimeout(() => {
        setShowModal(false);
        setUpdateMessage('');
      }, 2000);
    } catch (err) {
      setUpdateError(
        err.response?.data?.error || 'Cập nhật ngành nghề thất bại. Vui lòng thử lại.'
      );
    }
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTechnician(null);
    setSelectedServices([]);
    setUpdateError('');
    setUpdateMessage('');
  };

  // Tính toán phân trang
  const totalTechnicians = technicians.length;
  const totalPages = Math.ceil(totalTechnicians / techniciansPerPage);
  const startIndex = (currentPage - 1) * techniciansPerPage;
  const endIndex = startIndex + techniciansPerPage;
  const currentTechnicians = technicians.slice(startIndex, endIndex);

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="content-section">
      <h3>Danh sách thợ</h3>
      <p>Tổng thợ: {totalTechnicians}</p>

      {/* Tìm kiếm và lọc */}
      <div className="filter-section">
        <div className="search-section">
          <label htmlFor="search">Tìm kiếm: </label>
          <input
            type="text"
            id="search"
            placeholder="Tìm theo tên hoặc email..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-service">
          <label htmlFor="service-filter">Lọc theo ngành nghề: </label>
          <select
            id="service-filter"
            value={filteredService}
            onChange={handleFilterChange}
          >
            <option value="">Tất cả</option>
            {serviceTypes.map((service) => (
              <option key={service._id} value={service._id}>
                {service.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : totalTechnicians > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Ngành nghề</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentTechnicians.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name || 'N/A'}</td>
                  <td>{user.email}</td>
                  <td>{getSpecializations(user.services)}</td>
                  <td>
                    <span className={user.status === 'active' ? 'status-active' : 'status-inactive'}>
                      {user.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(user)}
                    >
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          {totalPages > 1 && (
            <RenderPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <p>Không có thợ nào.</p>
      )}

      {/* Modal chỉnh sửa ngành nghề */}
      {showModal && selectedTechnician && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Chỉnh sửa ngành nghề cho {selectedTechnician.name || 'N/A'}</h3>
            {updateError && <p style={{ color: 'red' }}>{updateError}</p>}
            {updateMessage && <p style={{ color: 'green' }}>{updateMessage}</p>}
            <div className="service-options">
              {serviceTypes.length > 0 ? (
                serviceTypes.map((service) => (
                  <label key={service._id} className="service-checkbox">
                    <input
                      type="checkbox"
                      value={service._id}
                      checked={selectedServices.includes(service._id)}
                      onChange={() => handleServiceChange(service._id)}
                    />
                    {service.label}
                  </label>
                ))
              ) : (
                <p>Không có danh mục dịch vụ nào để hiển thị.</p>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={handleCloseModal} className="modal-button cancel">
                Hủy
              </button>
              <button
                onClick={handleUpdateServices}
                className="modal-button confirm"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Technicians;