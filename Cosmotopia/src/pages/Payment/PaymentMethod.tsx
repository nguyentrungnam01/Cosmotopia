import { Image } from 'antd';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PaymentMethods({ ConfirmPayMent }) {
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState('direct');

  return (
    <div className="flex w-[935px] flex-col">
      {/* Header */}
      <div className="flex items-center justify-center border-b border-gray-300/50 px-4 py-8">
        <h2 className="font-montserrat text-[22px] font-bold text-[#4E4663]">
          Phương thức thanh toán
        </h2>
      </div>

      {/* Payment options */}
      <div className="flex flex-col gap-6 p-8">

        {/* Direct Payment Option */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="relative h-[18px] w-[18px]">
              <div
                className={`h-[18px] w-[18px] rounded-full border ${selectedMethod === 'direct'
                  ? 'border-[#6B72D6] bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF]'
                  : 'border-[#6C6C6C] bg-white'
                  }`}
                onClick={() => setSelectedMethod('direct')}
              >
                {selectedMethod === 'direct' && (
                  <div className="absolute left-[5px] top-[5px] h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-montserrat text-[18px] text-[#837D92]">
                Thanh toán trực tiếp (PayOS)
              </span>
              <span className="font-montserrat text-[16px] text-[#C6C3CD]">
                Thanh toán trực tiếp qua tài khoản ngân hàng.
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {/* <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white shadow-sm">
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="Bank 1"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white shadow-sm">
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="Bank 2"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white shadow-sm">
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="Bank 3"
                width={20}
                height={20}
                className="object-contain"
              />
            </div> */}
          </div>
        </div>

        {/* Other Payment Methods Option */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="relative h-[18px] w-[18px]">
              <div
                className={`h-[18px] w-[18px] rounded-full border ${selectedMethod === 'other'
                  ? 'border-[#6B72D6] bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF]'
                  : 'border-[#6C6C6C] bg-white'
                  }`}
              // onClick={() => setSelectedMethod('other')}
              >
                {selectedMethod === 'other' && (
                  <div className="absolute left-[5px] top-[5px] h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-montserrat text-[18px] text-[#837D92]">
                Thanh toán khi nhận hàng (Maintain)
              </span>
              <span className="font-montserrat text-[16px] text-[#C6C3CD]">
                Thanh toán tiền khi nhận được hàng 
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {/* <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#F9F9F9]">
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="PayPal"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#888888]">
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="GPay"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#333333]">
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="Apple Pay"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#5485EC]">
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="Paytm"
                width={20}
                height={20}
                className="object-contain"
              />
            </div> */}
          </div>
        </div>
      </div>

      

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 px-8 py-4">
        <p className="font-montserrat text-sm text-gray-500">
          Bằng cách nhấp vào "Đặt hàng", bạn đồng ý bị ràng buộc bởi{' '}
          <span className="text-[#936EFF]">Điều khoản chính</span>
        </p>
        <button
          className="rounded-full bg-[#936EFF] px-8 py-3 font-montserrat font-medium text-white"
          onClick={() => {
            ConfirmPayMent();
          }}
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
}


