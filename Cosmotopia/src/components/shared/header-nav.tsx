import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/use-sidebar';
import { usePathname } from '@/routes/hooks';
import { useRouter } from '@/routes/hooks';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchShoes } from '@/queries/shoes.query';
import { PagingModel } from '@/constants/data';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { sOpen } from '@/store/spin';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}
type ProductType = {
  id: string;
  name: string;
  price: string;
  sales: number;
};

export default function HeaderNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<ProductType[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [pagingModel, setPagingModel] = useState(PagingModel);
  const { mutateAsync: searchShoes } = useSearchShoes();

  const auth = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart.cartDetail);
  const isOpen = sOpen.use();


  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch();
    } else {
      setProducts([]);
    }
  }, [debouncedSearchTerm]);

  const handleSearch = async () => {
    const pagingSearch = { ...pagingModel, keyword: debouncedSearchTerm };
    const res = await searchShoes(pagingSearch);
    if (res) {
      setProducts(res.listObjects);
      console.log(res);
    }
  };

  if (!items?.length) {
    return null;
  }

  return (
    <nav className={`relative ${isOpen ? "-z-20" : 'z-10'} border-b border-gray-200 drop-shadow-md`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap justify-center space-x-8 py-4 sm:justify-start">
          <li>
            <button
              onClick={() => router.push("/productGrid")}
              className="text-gray-600 transition-colors duration-200 hover:text-purple-600 focus:outline-none"
            >
              Sản phẩm
            </button>
          </li>
          <li>
            <a
              href="#"
              className="text-gray-600 transition-colors duration-200 hover:text-purple-600"
            >
              Top Brand
            </a>
          </li>
          <li>
            <a
              className="text-gray-600 transition-colors duration-200 hover:text-purple-600"
              onClick={() =>
                router.push(`/reviews`)
              }
            >
              Top Reviews
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                router.push(`/scanner`)
              }
              className="text-gray-600 transition-colors duration-200 hover:text-purple-600 cursor-pointer"
            >
              Personal color test
            </a>
          </li>
          {/* <li>
            <a
              href="#"
              className="text-gray-600 transition-colors duration-200 hover:text-purple-600"
            >
              Lorem
            </a>
            ///
          </li> */}
        </ul>
      </div>
    </nav>
  );
}
