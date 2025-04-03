const useChartData = (stats) => {
    // Kiểm tra stats có tồn tại và có các thuộc tính cần thiết không
    const newUsers = stats?.newUsers && Array.isArray(stats.newUsers) ? stats.newUsers : [];
    const completedOrders = stats?.completedOrders && Array.isArray(stats.completedOrders) ? stats.completedOrders : [];
  
    const chartData = {
      labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
      datasets: [
        {
          label: 'Người dùng mới',
          data: newUsers.length > 0 ? newUsers : [65, 59, 80, 81, 56, 55],
          fill: false,
          borderColor: '#ff4500',
          tension: 0.1,
        },
        {
          label: 'Đơn hàng hoàn thành',
          data: completedOrders.length > 0 ? completedOrders : [28, 48, 40, 19, 86, 27],
          fill: false,
          borderColor: '#00c4b4',
          tension: 0.1,
        },
      ],
    };
  
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Thống kê người dùng và đơn hàng' },
      },
    };
  
    return { chartData, chartOptions };
  };
  
  export default useChartData;