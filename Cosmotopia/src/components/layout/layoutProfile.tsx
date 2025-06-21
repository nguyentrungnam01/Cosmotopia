import Sidebar from '../shared/sidebar';
import MobileSidebar from '../shared/mobile-sidebar';
import helper from '@/helpers/index';
import { login } from '@/redux/auth.slice';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useDispatch } from 'react-redux';
import { updateCart, updateTotalItems } from '@/redux/cart.slice';
import { useGetOrderUserByStatus } from '@/queries/cart.query';
import { PagingModel } from '@/constants/data';
import Footer from '../shared/footer';
import { ProfileSidebar } from '@/pages/ProfilePage/Sidebar';
import BasePages from '../shared/base-pages';
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { mutateAsync: getOrderByStatus } = useGetOrderUserByStatus();

  var token = helper.cookie_get('AT');
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (token) {
      dispatch(login());
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      let model = { ...PagingModel, orderStatus: 1 };
      var data = await getOrderByStatus(model);
      dispatch(updateCart(data));
      dispatch(updateTotalItems(data?.listObjects?.length));
    };
    fetch();
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-between overflow-visible bg-white ">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <BasePages className="relative mx-auto w-[80%] flex-1 p-4">
        <div className="mb-8 flex  w-full justify-between gap-10">
          <div className="flex w-1/4 flex-col gap-10">
            <ProfileSidebar />
          </div>
          <div className="flex w-3/4 flex-col rounded-md bg-white p-5 shadow-lg ">
            <main className="flex-1 overflow-y-auto bg-[#FBFBFB]">{children}</main>
          </div>
        </div>
        {/* <Footer /> */}
      </BasePages>
      <Footer />
      <Toaster />
    </div>
  );
}
