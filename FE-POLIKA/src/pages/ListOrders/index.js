import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../share/components/Layout/Header';
import BottomNav from '../../share/components/BottomNav';
import { getCustomerOrders, cancelOrder, updateOrder } from '../../services/Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RenderPagination from '../../share/components/Pagination/renderPagination';
import './ListOrders.css';

// Hàm định dạng ngày theo dd/mm/yyyy hh:mm:ss
const formatDate = (dateString) => {
  if (!dateString) return 'Không xác định';

  let normalizedDateString = dateString;
  if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
    normalizedDateString = `${dateString}.000Z`;
  }

  const date = new Date(normalizedDateString);
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return 'Không xác định';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

// Hàm chuyển đổi trạng thái sang tiếng Việt
const getStatusLabel = (status) => {
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    case 'pending':
    case 'accepted':
    default:
      return 'Đang xử lý';
  }
};

// Hàm lấy class CSS cho trạng thái
const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'status-completed';
    case 'cancelled':
      return 'status-cancelled';
    case 'pending':
    case 'accepted':
    default:
      return 'status-processing';
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('token') && user && (user.role === 'customer' || user.role === 'technician');

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(false); // State để kiểm soát chế độ chỉnh sửa
  const [editForm, setEditForm] = useState({}); // State để lưu dữ liệu form chỉnh sửa

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { redirectTo: '/list-orders' } });
    }
  }, [isLoggedIn, navigate]);

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getCustomerOrders({
        params: { page, limit: 10, sort: '-created_at' },
      });
      const fetchedOrders = response.data.orders || [];
      console.log('Fetched orders:', fetchedOrders);
      setOrders(fetchedOrders);
      setPagination(response.data.pagination || {});
      setFilteredOrders(fetchedOrders);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      await cancelOrder(orderId);
      toast.success('Hủy đơn hàng thành công!');
      fetchOrders(pagination.currentPage);
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error('Không thể hủy đơn hàng. Vui lòng thử lại.');
    }
  };

  const handleSaveEdit = async () => {
    try {
      // Chuyển đổi price thành số
      const updatedData = {
        ...editForm,
        price: parseFloat(editForm.price) || 0, // Chuyển price thành số, mặc định là 0 nếu không hợp lệ
      };
  
      // Kiểm tra dữ liệu trước khi gửi
      if (!editForm.phone_number.match(/^[0-9]{10,11}$/)) {
        toast.error('Số điện thoại phải có từ 10 đến 11 chữ số!');
        return;
      }
      if (updatedData.price < 0) {
        toast.error('Giá không được âm!');
        return;
      }
      if (
        !editForm.address.street ||
        !editForm.address.city ||
        !editForm.address.district ||
        !editForm.address.ward
      ) {
        toast.error('Địa chỉ phải bao gồm đường, phường/xã, quận/huyện và thành phố!');
        return;
      }
  
      // Gửi yêu cầu cập nhật và nhận dữ liệu trả về
      const response = await updateOrder(selectedOrder._id, updatedData);
      const updatedOrder = response.order; // Lấy dữ liệu đơn hàng đã cập nhật từ response
  
      // Cập nhật selectedOrder để làm mới modal
      setSelectedOrder(updatedOrder);
  
      toast.success('Cập nhật đơn hàng thành công!');
      setIsEditing(false); // Quay lại chế độ xem
      fetchOrders(pagination.currentPage); // Làm mới danh sách đơn hàng
    } catch (err) {
      console.error('Error updating order:', err);
      toast.error('Không thể cập nhật đơn hàng. Vui lòng thử lại.');
    }
  };

  const filterOrdersByDateAndStatus = () => {
    let filtered = orders;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        alert('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!');
        return;
      }

      filtered = orders.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= start && orderDate <= end;
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => {
        if (statusFilter === 'pending') {
          return order.status === 'pending' || order.status === 'accepted';
        }
        return order.status === statusFilter;
      });
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn, location.state?.refresh]);

  const openModal = (order) => {
    setSelectedOrder(order);
    setEditForm({
      address: order.address || { street: '', city: '', district: '', ward: '', country: 'Vietnam' },
      price: order.price || '',
      phone_number: order.phone_number || '',
      description: order.description || '',
    });
    setIsEditing(false);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsEditing(false);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Header />
      <ToastContainer autoClose={2000}/>
      <div className="orders-container">
        <div className="orders-header">
          <h2>
            <i className="fa-solid fa-file-invoice" style={{ marginRight: '10px' }} />
            Danh Sách Đơn Hàng
          </h2>
        </div>

        <div className="date-filter">
          <div className="date-input-group">
            <label htmlFor="start-date">Ngày bắt đầu:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="end-date">Ngày kết thúc:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="status-filter">Trạng thái:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <button className="search-button" onClick={filterOrdersByDateAndStatus}>
            Tìm kiếm
          </button>
        </div>

        <div className="orders-section">
          {isLoading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : filteredOrders.length === 0 ? (
            <p className="no-orders">
              {startDate || endDate || statusFilter !== 'all'
                ? 'Không tìm thấy đơn hàng phù hợp.'
                : 'Bạn chưa có đơn hàng nào.'}
            </p>
          ) : (
            <ul className="orders-list">
              {filteredOrders.map((order) => (
                <li key={order._id} className="order-item">
                  <div className="order-details" onClick={() => openModal(order)}>
                    <p className="order-date">
                      <strong>Ngày:</strong> {formatDate(order.created_at)}
                    </p>
                    <p className="order-action">
                      <strong>Hành động:</strong> Đặt dịch vụ {order.service_type}
                    </p>
                    <p className="order-status">
                      <strong>Trạng thái:</strong>{' '}
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </p>
                  </div>
                  {user.role === 'customer' && (
                    <>
                      {order.status === 'pending' ? (
                        <button
                          className="cancel-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelOrder(order._id);
                          }}
                        >
                          Hủy đơn
                        </button>
                      ) : order.status === 'cancelled' ? (
                        <button className="cancelled-button" disabled>
                          Đã hủy đơn
                        </button>
                      ) : null}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <RenderPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => fetchOrders(page)}
          />
        )}

        {selectedOrder && (
          <div className="order-detail-modal">
            <div className="order-detail-modal-content">
              <div className="order-detail-modal-header">
                <h3>{isEditing ? 'Chỉnh sửa đơn hàng' : 'Chi tiết đơn hàng'}</h3>
                <button className="close-button" onClick={closeModal}>
                  <i className="fa-solid fa-times" />
                </button>
              </div>
              <div className="order-detail-modal-body">
                {isEditing ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label htmlFor="edit-address-street">Địa chỉ (Đường):</label>
                      <input
                        type="text"
                        id="edit-address-street"
                        value={editForm.address.street}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            address: { ...editForm.address, street: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-address-ward">Phường/Xã:</label>
                      <input
                        type="text"
                        id="edit-address-ward"
                        value={editForm.address.ward}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            address: { ...editForm.address, ward: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-address-district">Quận/Huyện:</label>
                      <input
                        type="text"
                        id="edit-address-district"
                        value={editForm.address.district}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            address: { ...editForm.address, district: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-address-city">Thành phố:</label>
                      <input
                        type="text"
                        id="edit-address-city"
                        value={editForm.address.city}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            address: { ...editForm.address, city: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-address-country">Quốc gia:</label>
                      <input
                        type="text"
                        id="edit-address-country"
                        value={editForm.address.country}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            address: { ...editForm.address, country: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-price">Giá:</label>
                      <input
                        type="number"
                        id="edit-price"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-phone">Số điện thoại:</label>
                      <input
                        type="text"
                        id="edit-phone"
                        value={editForm.phone_number}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone_number: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-description">Mô tả:</label>
                      <textarea
                        id="edit-description"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({ ...editForm, description: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-actions">
                      <button className="save-button" onClick={handleSaveEdit}>
                        Lưu
                      </button>
                      <button className="cancel-button" onClick={() => setIsEditing(false)}>
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="order-detail-item">
                      <strong>Ngày:</strong> {formatDate(selectedOrder.created_at)}
                    </p>
                    <p className="order-detail-item">
                      <strong>Hành động:</strong> Đặt dịch vụ {selectedOrder.service_type}
                    </p>
                    <p className="order-detail-item">
                      <strong>Trạng thái:</strong>{' '}
                      <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </p>
                    <p className="order-detail-item">
                      <strong>
                        {user.role === 'customer' ? 'Kỹ thuật viên:' : 'Khách hàng:'}
                      </strong>{' '}
                      {user.role === 'customer'
                        ? selectedOrder.technician_id?.name || 'Chưa có kỹ thuật viên'
                        : selectedOrder.customer_id?.name || 'Không xác định'}
                    </p>
                    <p className="order-detail-item">
                      <strong>Địa chỉ:</strong>{' '}
                      {selectedOrder.address
                        ? `${selectedOrder.address.street}, ${selectedOrder.address.ward}, ${selectedOrder.address.district}, ${selectedOrder.address.city}, ${selectedOrder.address.country}`
                        : 'Không xác định'}
                    </p>
                    <p className="order-detail-item">
                      <strong>Giá:</strong>{' '}
                      {selectedOrder.price
                        ? `${selectedOrder.price.toLocaleString()} VNĐ`
                        : 'Không xác định'}
                    </p>
                    <p className="order-detail-item">
                      <strong>Số điện thoại:</strong>{' '}
                      {selectedOrder.phone_number || 'Không xác định'}
                    </p>
                    {selectedOrder.updated_at && selectedOrder.status === 'completed' && (
                      <p className="order-detail-item">
                        <strong>Ngày hoàn thành:</strong> {formatDate(selectedOrder.updated_at)}
                      </p>
                    )}
                    {selectedOrder.description && (
                     <div className="order-detail-item description">
                     <strong>Mô tả:</strong>
                     <span>{selectedOrder.description}</span>
                   </div>
                    )}
                    {user.role === 'customer' && selectedOrder.status === 'pending' && (
                      <button className="edit-button" onClick={() => setIsEditing(true)}>
                        Sửa
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </>
  );
};

export default Orders;