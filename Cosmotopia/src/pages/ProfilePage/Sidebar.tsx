import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { User, Bookmark, ShoppingBag, Bell, Ticket } from 'lucide-react';
import { BarChart } from 'lucide-react';

const menuItems = [
  {
    id: 'account',
    title: 'Tài khoản của tôi',
    icon: User,
    items: [
      { id: 'profile', title: 'Hồ sơ', to: '/profile' },
      // { id: 'payment', title: 'Thanh toán', to: '/profile/payment' },
      { id: 'address', title: 'Địa chỉ', to: '/profile/address' },
      { id: 'password', title: 'Đổi mật khẩu', to: '/profile/password' }
    ]
  },
  {
    id: 'saved',
    title: 'Sản phẩm đã lưu',
    icon: Bookmark

    // to: "/profile/saved",
  },
  {
    id: 'orders',
    title: 'Đơn hàng',
    icon: ShoppingBag,
    to: '/profile/orders'
  },
  {
    id: 'notifications',
    title: 'Thông báo',
    icon: Bell

    // to: "/profile/notifications",
  },
  {
    id: 'promotions',
    title: 'Ưu đãi',
    icon: Ticket

    // to: "/profile/promotions",
  },
  {
    id: 'affiliate',
    title: 'Affiliate',
    icon: BarChart,
    to: "/kol/tongquan",
  },
];

export function ProfileSidebar() {
  const location = useLocation();
  const isSelected = (item, currentLocation) => {
    return currentLocation.pathname === item.to;
  };
  const isParentSelected = (menuItem, currentLocation) => {
    return menuItem.items.some((subItem) => currentLocation.pathname === subItem.to);
  };
  return (
    <div className="w-full space-y-3 font-montserrat">
      {menuItems.map((item) => (
        <div key={item.id} className="rounded-md bg-white p-3 shadow-lg">
          {item.items ? (
            <div>
              <div className="flex items-center gap-4">
                <item.icon className="h-6 w-6 text-[#4E4663]" />
                <span
                  className={cn(
                    'text-base font-normal',
                    isParentSelected(item, location)
                      ? 'bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text text-transparent'
                      : 'text-[#4E4663]/80 hover:text-[#4E4663]'
                  )}
                >
                  {item.title}
                </span>
              </div>
              <div className="ml-[40px] mt-3 space-y-3">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={subItem.to}
                    className={cn(
                      'flex items-center gap-3 text-base font-normal transition-colors duration-200',
                      isSelected(subItem, location)
                        ? 'bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text text-transparent'
                        : 'text-[#4E4663]/80 hover:text-[#4E4663]'
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              to={item.to || '#'}
              className="flex items-center gap-4 text-[#4E4663] transition-colors duration-200 hover:text-[#4E4663]/80"
            >
              <item.icon className="h-6 w-6" />
              <span
                className={cn(
                  'text-base font-normal',
                  isSelected(item, location) &&
                    'bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] bg-clip-text text-transparent'
                )}
              >
                {item.title}
              </span>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
