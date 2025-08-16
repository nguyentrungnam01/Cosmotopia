import { Image } from 'antd';
import { Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGetAllOrdersBySelf } from '@/queries/cart.query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useNavigate } from 'react-router-dom';

// Gom map status vào chung
const statusMap = {
  all: { id: 'all', label: 'Tất cả', text: '' },
  pending: { id: 'pending', label: 'Chờ thanh toán', text: 'chờ thanh toán' },
  confirmed: { id: 'confirmed', label: 'Đã thanh toán', text: 'đã thanh toán' },
  delivering: { id: 'delivering', label: 'Đang giao', text: 'đang giao' },
  shipping: { id: 'shipping', label: 'Đã giao', text: 'đã được giao thành công' },
  cancelled: { id: 'cancelled', label: 'Đã hủy', text: 'đã hủy' }
};

// Hàm map số -> key
const mapStatusKey = (status) => {
  switch (status) {
    case 0: return 'pending';
    case 1: return 'confirmed';
    case 2: return 'delivering';
    case 3: return 'shipping';
    case 4: return 'cancelled';
    default: return 'all';
  }
};

export default function OrderTracking() {
  const [activeStatus, setActiveStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useGetAllOrdersBySelf(currentPage, 3);
  const navigate = useNavigate();

  dayjs.extend(utc);
  dayjs.extend(timezone);

  if (isLoading) return <p className="text-center py-4">Đang tải đơn hàng...</p>;
  if (error) return <p className="text-center py-4 text-red-500">Lỗi khi tải đơn hàng!</p>;

  const allOrders =
    (data?.orders ?? []).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  const filteredOrders =
    activeStatus === 'all'
      ? allOrders
      : allOrders.filter((order) => mapStatusKey(order.status) === activeStatus);

  const totalPages = data?.totalPages || 1;

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4">
      {/* Status Navigation */}
      <div className="flex flex-wrap items-center justify-start gap-2 rounded-md bg-white p-2 shadow-lg">
        {Object.values(statusMap).map((status) => (
          <button
            key={status.id}
            onClick={() => {
              setActiveStatus(status.id);
              setCurrentPage(1);
            }}
            className={`rounded-xl px-4 py-2 text-sm font-montserrat transition-colors ${activeStatus === status.id
                ? 'bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text font-semibold text-transparent'
                : 'text-[#4E4663]'
              }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Order List */}
      {filteredOrders?.length > 0 ? (
        filteredOrders.map((order) => {
          const statusKey = mapStatusKey(order.status);
          return (
            <div
              key={order.orderId}
              className="rounded-3xl bg-white p-4 md:p-6 shadow-lg space-y-4"
            >
              {/* Delivery Status */}
              <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-0">
                <div className="flex items-center gap-2 border-b border-gray-200/50 pb-2 md:pb-4">
                  <Truck className="h-6 w-6 text-[#9C3CFD]" />
                  <span className="bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text font-montserrat text-sm text-transparent">
                    Đơn hàng {statusMap[statusKey]?.text}
                  </span>
                </div>
                <span className="text-sm font-montserrat bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text text-transparent">
                  {dayjs.utc(order.orderDate).tz('Asia/Ho_Chi_Minh').format('HH:mm DD/MM/YYYY')}
                </span>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                {order.orderDetails.map((item) => (
                  <div
                    key={item.orderDetailId}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200/50 pb-4"
                  >
                    <div className="flex gap-3">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={item.imageUrl[0]}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover rounded-xl"
                        />
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg text-[#4E4663] font-montserrat font-semibold">
                          {item.name}
                        </h3>
                        <div className="mt-1 text-lg md:text-xl font-bold font-montserrat bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text text-transparent">
                          {item.unitPrice.toLocaleString()} VNĐ
                        </div>
                      </div>
                    </div>
                    <div className="text-right w-full sm:w-auto">
                      <span className="font-montserrat text-sm md:text-base text-[#4E4663]">
                        <b>Số lượng: {item.quantity}</b>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="font-montserrat text-base md:text-lg font-medium text-[#4E4663]">
                    Tổng:
                  </span>
                  <span className="font-montserrat text-lg md:text-xl font-bold text-[#347B28]">
                    {order.totalAmount.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="mt-4 text-center text-gray-500">Không có đơn hàng nào</p>
      )}

      {/* Pagination Controls (nếu muốn bật lại) */}
      {/* <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="rounded-lg bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] px-4 py-2 font-montserrat font-bold text-white shadow-lg disabled:opacity-50"
        >
          Trước
        </button>
        <span className="flex items-center text-lg font-medium">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="rounded-lg bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] px-4 py-2 font-montserrat font-bold text-white shadow-lg disabled:opacity-50"
        >
          Tiếp
        </button>
      </div> */}
    </div>
  );
}
