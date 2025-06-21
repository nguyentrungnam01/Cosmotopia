import BasePages from '@/components/shared/base-pages.js';
import Logo from '@/assets/62 1.png';
import { useRouter } from '@/routes/hooks';
import { useEffect, useState } from 'react';

export default function Payment() {
  const router = useRouter();
  const [content, setContent] = useState({
    type: 'Thanh toán',
    message:
      'Cảm ơn bạn đã mua hàng của chúng tôi, nếu có bất kỳ vấn để gì hãy liên lạc với chúng tôi'
  });

  return (
    <>
      <BasePages className="relative mx-auto w-[80%] flex-1 p-4">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <div className="relative h-[435px] w-[435px]">
            <img src={Logo} alt="Payment Success" width={435} height={435} />
          </div>

          <div className="mt-4 flex flex-col items-center gap-3">
            <h1 className="bg-gradient-to-r from-[#ED1DBF] via-[#A831F1] to-[#3561FE] bg-clip-text text-center font-montserrat text-[44px] font-bold leading-[50px] text-transparent">
              Thank you !
            </h1>

            <h2 className="font-montserrat text-[22px] font-bold leading-7 text-[#423A59]">
              {content?.type} thành công
            </h2>
          </div>

          <span
            onClick={() => router.push('/profile/orders')}
            className="font-monsterrat mt-2 cursor-pointer text-base text-[#4E4663] underline"
          >
            Xem đơn hàng của bạn
          </span>
          <p className="max-w-[739px] text-center font-montserrat text-base text-[#4E4663]">
            {content?.message}
          </p>
        </div>
      </BasePages>
    </>
  );
}
