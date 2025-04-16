import Http from "./Http";
    export const getAllUsers = (config)=> Http.get(`/users`, config);
    export const register = (userData) => Http.post(`/register`, userData);
    export const createUser = (userData) => Http.post(`/createUser`, userData);
    export const login = (credentials) => Http.post(`/login`, credentials).then(response => response);
    export const updateUser = (userId, userData) => Http.put(`/users/${userId}`, userData);
    export const deleteUser = (userId) => Http.delete(`/users/${userId}`);
    export const getStats = () => Http.get('/stats');
    export const createOrder= (orderData) => Http.post('/create-order', orderData).then(response => response.data);;
    //lấy danh sách đơn hàng của 1 khách hàng
    export const getCustomerOrders = (config) => Http.get('/customer/orders', config);
    //lấy danh sách đơn hàng của tất cả khách hàng
    export const getAllOrders = (config) => Http.get('/all-orders', config);
    //lấy danh sách đơn hàng của tất cả khách hàng không cần xác thực
    export const getPublicOrders = (config) => Http.get('/list-Orders-Home', config);

    export const cancelOrder = (orderId, config) => Http.put(`/orders/${orderId}/cancel`, config);
    export const updateOrder = (orderId, data) => Http.put(`/orders/${orderId}`, data).then(response => response.data);;
    export const getUserInfo = () => Http.get(`/user-info`).then(response => response.data);
        // Thêm các hàm mới cho category-service
    export const getCategoryService = () => Http.get('/category-service');
    export const createCategoryService = (categoryData) => Http.post('/category-service', categoryData).then(response => response.data);
    export const updateCategoryService = (categoryId, categoryData) => Http.put(`/category-service/${categoryId}`, categoryData).then(response => response.data);
    export const deleteCategoryService = (categoryId) => Http.delete(`/category-service/${categoryId}`).then(response => response.data);
    export const updateUserFcmToken = (userId, fcmToken) => Http.put(`/users/${userId}/fcm-token`, { fcmToken });



    