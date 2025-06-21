import HeaderNav from '@/components/shared/header-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import cosmeLogo from '@/assets/logo/cosme_logo.png';
import { LogOutIcon, Search } from 'lucide-react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from '@/routes/hooks';
import helper from '@/helpers/index';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useLogout } from '@/queries/auth.query';
import { logout } from '@/redux/auth.slice';
import { useEffect, useRef, useState } from 'react';
import { UserAccountMenu } from './user-account-menu';
import { Input } from '../ui/input';
import { useGetListProductsByPaging } from '@/queries/product.query';
import { Link } from 'react-router-dom';
import { sOpen } from '@/store/spin';

export default function Sidebar() {
  const router = useRouter();
  const accessToken = helper.cookie_get('AT');
  const auth = useSelector((state: RootState) => state.auth.isLogin);
  const { mutateAsync: logoutAccount } = useLogout();
  const dispatch = useDispatch();
  const isOpen = sOpen.use();
  const [searchQuery, setSearchQuery] = useState('');
  // const [isOpen, sOpen.set] = useState(false);
  const dropdownRef = useRef(null);

  const { data: productData, refetch } = useGetListProductsByPaging({
    page: 1,
    pageSize: 4,
    search: searchQuery
  });

  const products = productData?.products || [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        sOpen.set(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      refetch();
      sOpen.set(true);
    } else {
      sOpen.set(false);
    }
  }, [searchQuery, refetch]);

  const handleLogout = async () => {
    await logoutAccount({ accessToken });
    helper.cookie_delete('RT');
    helper.cookie_delete('AT');
    helper.cookie_delete('user');
    router.push('/login');
    dispatch(logout());
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      router.push(`/productGrid?query=${encodeURIComponent(searchQuery.trim())}`);
      sOpen.set(false);


    }
  };

  return (
    <nav className={cn(`relative z-10 mx-auto w-[100%] flex-none md:block`)}>
      <div className="mx-auto w-full justify-center px-0">
        <div className="flex items-center justify-between border-b-2 border-gray-200 py-4 drop-shadow-md pl-16">
          <span
            onClick={() => router.push('/')}
            className="flex cursor-pointer items-center text-[36px]"
          >
            <img src={cosmeLogo} alt="cosme-logo" className="mr-2 h-8 w-8" />{' '}
            Cosmo
          </span>
          <div className="relative z-50 ml-12 mr-12 flex-1 " ref={dropdownRef}>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full rounded-full bg-gray-100 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchEnter}
              />
            </div>
            {isOpen && (
              <div className="absolute left-0 right-0 z-[999] ml-6 mr-6 mt-0.5  max-h-60 overflow-y-auto rounded-xl border border-gray-300 bg-white">
                {products.length > 0 ? (
                  products.map((product) => (
                    <Link
                      to={`/product/${product.productId}`}
                      key={product.productId}
                      className="block px-6 py-3 hover:bg-gray-100 "
                      onClick={() => sOpen.set(false)}
                    >
                      {product.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-3 text-gray-500">
                    Không có kết quả nào
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 mr-16">
            <div className="cart">
              <ShoppingCartIcon className="text-blue-500 mr-1 h-6 w-6" />
              <span
                onClick={() => router.push('/cart')}
                className="cursor-pointer font-montserrat"
              >
                Giỏ hàng
              </span>
            </div>
            <div className="user flex items-center">
              <UserAccountMenu auth={auth} handleLogout={handleLogout} />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <HeaderNav items={navItems} />
        </div>
      </div>
    </nav>
  );
}
