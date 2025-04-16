import React, { useState, useEffect } from 'react';
import { getAllOrders } from '../../../services/Api';
import RenderPagination from '../../../share/components/Pagination/renderPagination';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // State chính để điều khiển trang hiện tại
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    totalRows: 0,
    totalPages: 0,
    currentPage: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async (currentPage) => {
    try {
      setLoading(true);
      const config = {
        params: {
          page: currentPage,
          limit: limit,
        },
      };
      const response = await getAllOrders(config);
      if (response.data.success) {
        setOrders(response.data.orders || []);
        setTotalOrders(response.data.pagination?.totalRows || 0);
        setPagination({
          totalRows: response.data.pagination?.totalRows || 0,
          totalPages: response.data.pagination?.totalPages || 0,
          currentPage: currentPage, // Đồng bộ với currentPage được truyền vào
          hasNext: response.data.pagination?.hasNext || false,
          hasPrev: response.data.pagination?.hasPrev || false,
        });
      } else {
        setError('Không thể lấy dữ liệu đơn hàng.');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.street}, ${address.ward}, ${address.district}, ${address.city}`;
  };

  return (
    <div className="content-section">
      <h3>Danh sách đơn hàng</h3>
      <div className="total-orders">
        <p>Tổng số đơn hàng: <strong>{totalOrders}</strong></p>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : orders.length === 0 ? (
        <p>Chưa có dữ liệu đơn hàng.</p>
      ) : (
        <>
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID Đơn hàng</th>
                <th>Khách hàng</th>
                <th>Loại dịch vụ</th>
                <th>Số điện thoại</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id || 'N/A'}</td>
                  <td>{order.customer_id?.name || 'N/A'}</td>
                  <td>{order.service_type?.label || 'N/A'}</td>
                  <td>{order.phone_number || 'N/A'}</td>
                  <td>{order.price ? order.price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</td>
                  <td>{order.status || 'N/A'}</td>
                  <td>{order.created_at ? formatDate(order.created_at) : 'N/A'}</td>
                  <td>
                    <button
                      className="details-btn"
                      onClick={() => handleViewDetails(order)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <RenderPagination
            currentPage={page} // Sử dụng page thay vì pagination.currentPage
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Chi tiết đơn hàng</h3>
            <div className="modal-body">
              <p>
                <strong>Khách hàng:</strong> {selectedOrder.customer_id?.name || 'N/A'}
              </p>
              <p>
                <strong>Loại dịch vụ:</strong> {selectedOrder.service_type?.label || 'N/A'}
              </p>
              <p>
                <strong>Mô tả:</strong> {selectedOrder.description || 'N/A'}
              </p>
              <p>
                <strong>Địa chỉ:</strong>{' '}
                {selectedOrder.address ? formatAddress(selectedOrder.address) : 'N/A'}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedOrder.phone_number || 'N/A'}
              </p>
              <p>
                <strong>Giá:</strong>{' '}
                {selectedOrder.price ? selectedOrder.price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}
              </p>
              <p>
                <strong>Trạng thái:</strong> {selectedOrder.status || 'N/A'}
              </p>
              <p>
                <strong>Ngày tạo:</strong>{' '}
                {selectedOrder.created_at ? formatDate(selectedOrder.created_at) : 'N/A'}
              </p>
            </div>
            <div className="modal-footer">
              <button className="close-btn" onClick={handleCloseModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;