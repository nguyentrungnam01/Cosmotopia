import BasePages from '@/components/shared/base-pages.js';
import { useRouter } from '@/routes/hooks';
import { Button, ConfigProvider, Image, message, Rate, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { MoreOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useGetDetailProduct } from '@/queries/product.query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FormRating } from './FormRating';
import { trackClick } from '@/queries/affilate.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AddCart } from '@/queries/cart.api';
interface TabContent {
  title: string;
  detail: string | string[];
}

export default function ProductDetail() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>(); // Get product ID from URL
  const { data, isLoading } = useGetDetailProduct(id); // Fetch product details
  const auth = useSelector((state: RootState) => state.auth.isLogin);
  console.log('Product: ', data);
  const [listContent, setListContent] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [indexImg, setIndexImg] = useState(0);
  console.log(data?.description);
  const navigate = useNavigate();
  const handleAddCart = () => {
    console.log('oke');
    console.log(auth);
    if (!auth) {
      message.error('Bạn phải đăng nhập mới có thể thêm sản phẩm vào giỏ hàng');
      navigate('/login');
    } else {
      const model = {
        productId: id,
        quantity: quantity
      };
      AddCart(model).then((data) => {
        console.log(data);
        message.success('Bạn đã thêm sản phẩm vào giỏ hàng thành công');
      });
    }
  };
  // const listContent = [
  //   // { title: 'Chi tiết sản phẩm', detail: data?.description || [] },
  //   { title: 'Cách dùng', detail: data?.usage || [] },
  //   { title: 'Thành phần', detail: data?.ingredients || [] },
  //   { title: 'Đánh giá', detail: data?.reviews || [] },
  // ];
  const ref = searchParams.get('ref');
  useEffect(() => {
    if (ref) {
      trackClick(ref).then((data) => {
        console.log(data);
      });
    }
  }, []);
  const [currentTab, setCurrentTab] = useState<TabContent | null>(null);
  useEffect(() => {
    if (data) {
      setListContent([
        { title: 'Chi tiết sản phẩm', detail: data?.description || [] },
        {
          title: 'Cách dùng',
          detail:
            data?.usage ||
            'Làm ướt mặt bằng nước ấm. Lấy một lượng sữa rửa mặt vừa đủ, tạo bọt nhẹ nhàng. Massage theo chuyển động tròn trong 30-60 giây. Rửa sạch lại với nước và lau khô bằng khăn mềm.'
        },
        {
          title: 'Thành phần',
          detail:
            data?.ingredients ||
            'Hyaluronic Acid, Niacinamide (Vitamin B3), Salicylic Acid (BHA), Retinol (Vitamin A), Vitamin C, Collagen, Peptide, Ceramide, AHA (Glycolic Acid, Lactic Acid), Benzoyl Peroxide, Centella Asiatica (Rau má), Zinc Oxide, Titanium Dioxide, Glycerin, Allantoin, Green Tea Extract, Snail Mucin, Arbutin, Kojic Acid, Ferulic Acid'
        },
        {
          title: 'Đánh giá',
          detail: data?.reviews || [
            {
              reviewer: 'Nguyễn Thuý An',
              rating: 5,
              content:
                'Sản phẩm rất tuyệt! Màu sắc tự nhiên, giữ màu lâu và không gây kích ứng.',
              time: '2024-03-05 14:30'
            },
            {
              reviewer: 'Trần Minh Hoàng',
              rating: 4,
              content:
                'Mình thấy chất lượng ổn, nhưng màu có hơi nhạt hơn so với hình.',
              time: '2024-03-04 10:15'
            },
            {
              reviewer: 'Lê Hồng Nhung',
              rating: 5,
              content:
                'Cực kỳ ưng ý, giao hàng nhanh, đóng gói đẹp. Mua lần thứ 2 rồi!',
              time: '2024-03-03 18:45'
            },
            {
              reviewer: 'Phạm Quốc Bảo',
              rating: 3,
              content: 'Màu đẹp nhưng hơi bột, không hợp với da khô lắm.',
              time: '2024-03-02 12:20'
            },
            {
              reviewer: 'Vũ Hải Yến',
              rating: 4,
              content:
                'Son lên màu đẹp nhưng độ bám không được lâu như mong đợi.',
              time: '2024-03-01 09:50'
            }
          ]
        }
      ]);
      setCurrentTab({
        title: 'Chi tiết sản phẩm',
        detail: data?.description || []
      });
    }
  }, [data]);
  if (isLoading) {
    return <Spin className="flex h-screen items-center justify-center" />;
  }

  if (!data) {
    return <p className="text-red-500 text-center">Không tìm thấy sản phẩm!</p>;
  }

  const listImg = data?.imageUrls || []; // Ảnh từ API
  const length = listImg.length;
  console.log('Image URL:', listImg[indexImg]);
  return (
    <BasePages
      className="relative mx-auto w-[80%] flex-1 p-4"
      pageHead="Cosmo"
    >
      <div className="flex items-center gap-4 " style={{ height: '670px' }}>
        {/* Danh sách ảnh nhỏ */}
        <div className="flex w-1/12 flex-col items-center justify-between gap-4 ">
          <img
            src="./arrowUp.svg"
            alt=""
            className="w-full hover:cursor-pointer"
            onClick={() => setIndexImg(Math.max(0, indexImg - 1))}
          />
          {listImg.map((url, index) => (
            <img
              key={index}
              src={url}
              alt=""
              className={`h-20 w-full rounded-lg transition-all duration-300 hover:cursor-pointer ${
                index === indexImg
                  ? 'scale-105 shadow-lg ring-2 ring-purple-500'
                  : 'opacity-60'
              }`}
              onClick={() => setIndexImg(index)}
            />
          ))}
          <img
            src="./arrowDown.svg"
            alt=""
            className="w-full hover:cursor-pointer"
            onClick={() => setIndexImg(Math.min(length - 1, indexImg + 1))}
          />
        </div>

        {/* Ảnh chính */}
        <div className="flex w-7/12 justify-center">
          <Image
            src={listImg[indexImg]}
            style={{ height: '582px', width: '100%' }}
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex w-1/3 flex-col ">
          <h2 className="text-3xl font-bold text-[#3D3D3D]">{data.name}</h2>
          <div className="mt-3 flex items-center justify-between">
            <Rate disabled defaultValue={data?.rating || 4} />
            <span>{data?.rating || 4}/5</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-2xl font-semibold text-purple-500">
              {/* {data.price} VNĐ */}
              {new Intl.NumberFormat('vi-VN').format(data.price)} VND
            </span>
            {/* <span className="text-gray-400 line-through">
              {data.oldPrice} VNĐ
            </span> */}
            {/* <span className="rounded bg-[rgba(255,0,0,0.1)] px-2 py-0.5 text-xs font-medium text-[rgba(255,0,0,0.8)]">
              -{data.discount}%
            </span> */}
          </div>
          <p className="mt-2 text-gray-600">{data.description}</p>

          {/* Chọn số lượng */}
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center rounded-xl bg-gray-100">
              <button
                className="border-none px-3 py-2 text-xl font-bold text-gray-600"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                value={quantity}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setQuantity(
                    value > data.stockQuantity ? data.stockQuantity : value
                  );
                }}
                className="w-12 border-none bg-gray-100 py-2 text-center text-[#9C3CFD]"
              />
              <button
                className="border-none px-3 py-2 text-xl font-bold text-gray-600"
                onClick={() =>
                  setQuantity(Math.min(data.stockQuantity, quantity + 1))
                }
              >
                +
              </button>
            </div>
            <span>{data?.stockQuantity} Sản phẩm có sẵn</span>
          </div>

          {/* Nút hành động */}
          <div className="mt-4 flex items-center gap-6">
            <button
              className="w-96 rounded-full bg-[#F5F5F5] px-6 py-3 text-base font-medium text-black"
              onClick={handleAddCart}
            >
              Thêm vào giỏ hàng
            </button>
            <button
              // onClick={() => router.push(`/payment?productId=${id}&quantity=${quantity}`)}
              onClick={() => {
                navigate('/payment', {
                  state: [
                    {
                      productId: id,
                      name: data.name,
                      price: data.price,
                      quantity: quantity,
                      imageUrl: listImg[0] || 'abc'
                    }
                  ]
                });
              }}
              className="w-80 rounded-full bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] px-6 py-3 text-base font-medium text-white"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex items-center justify-between px-2 py-4">
          {listContent?.map((tab, index) => (
            <button
              key={index}
              onClick={() => setCurrentTab(tab)}
              className={`relative py-2 font-medium text-gray-600 transition-all ${
                currentTab?.title === tab.title ? ' text-purple-500' : ''
              }`}
            >
              {tab.title}
              {currentTab?.title === tab.title && (
                <div className="absolute -bottom-1 left-0 h-[2px] w-full bg-purple-500"></div>
              )}
            </button>
          ))}
        </div>
        <div className="min-h-32 py-4">
          {currentTab?.title !== 'Đánh giá' ? (
            // currentTab?.detail.map((a, idx) => <p key={idx}>{a}</p>)
            <p>{currentTab?.detail}</p>
          ) : (
            <div>
              <div className="mb-4 flex justify-between">
                <p> Tất cả đánh giá ({currentTab?.detail?.length})</p>
                {id && <FormRating ProductID={id} />}
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                {currentTab?.detail.map((review, idx) => (
                  <div
                    key={idx}
                    className="w-[calc(50%-8px)] rounded-xl border bg-white p-4 shadow-md"
                  >
                    <MoreOutlined className="absolute right-4 top-4 cursor-pointer text-gray-500" />
                    <Rate
                      disabled
                      defaultValue={review.rating}
                      className="text-yellow-500 mb-2"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold">
                        {review.reviewer}
                      </span>
                      <CheckCircleFilled className="text-green-500" />
                    </div>
                    <p className="mt-2 text-gray-600">{review.content}</p>
                    <p className="mt-2 text-sm text-gray-400">{review.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BasePages>
  );
}
