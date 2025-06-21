import React, { useEffect, useState } from 'react';
import BasePages from '@/components/shared/base-pages.js';
import { useSearchParams } from 'react-router-dom';
import { Result, Spin } from 'antd';
import { getTransactions, handleTransactions } from '@/queries/user.api';
import { useRouter } from '@/routes/hooks';


interface ResultProps {
  status: 'success' | 'error';
  title: string;
  subTitle: string;
}

export default function HandlePayment() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const [resultProps, setResultProps] = useState<ResultProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const txnId = searchParams.get('id');
    const responseCode = searchParams.get('code');
    const cancelFlag = searchParams.get('cancel');
    const statusParam = searchParams.get('status');
    const orderCode = searchParams.get('orderCode');
    console.log(txnId, responseCode, cancelFlag, statusParam, orderCode);
    if (!txnId) {
      setResultProps({
        status: 'error',
        title: 'Thiếu thông tin giao dịch',
        subTitle: 'Không tìm thấy tham số “id” trong URL.'
      });
      setLoading(false);
      return;
    }

    (async () => {
      try {
        console.log("Order Code: ", orderCode);
        const tx = await getTransactions(orderCode);
        console.log("Response Payment: ", tx);
        const currentStatus = tx.status;
        console.log(currentStatus);
        console.log(statusParam);
        console.log(cancelFlag);

        let finalResult: ResultProps;

        if (currentStatus === 0) {
          if (cancelFlag === 'true' && statusParam === 'CANCELLED') {
            await handleTransactions(orderCode, 2);
            finalResult = {
              status: 'error',
              title: 'Bạn đã hủy thanh toán',
              subTitle: `Giao dịch ${orderCode} đã được hủy theo yêu cầu.`
            };
          } else if (responseCode === '00' && statusParam === 'PAID') {
            await handleTransactions(orderCode, 1);
            finalResult = {
              status: 'success',
              title: 'Thanh toán thành công',
              subTitle: `Đơn hàng ${orderCode} đã được thanh toán!`
            };
          } else {
            await handleTransactions(orderCode, 2);
            finalResult = {
              status: 'error',
              title: 'Thanh toán không thành công',
              subTitle: `Giao dịch ${orderCode} không hoàn tất. Vui lòng thử lại.`
            };
          }
        }
        else if (currentStatus === 1) {
          finalResult = {
            status: 'success',
            title: 'Thanh toán thành công',
            subTitle: `Đơn hàng ${orderCode} đã được thanh toán!`
          };
        }
        else {
          const wasCancelled = cancelFlag === 'true' && statusParam === 'CANCELLED';
          finalResult = wasCancelled
            ? {
              status: 'error',
              title: 'Bạn đã hủy thanh toán',
              subTitle: `Giao dịch ${orderCode} đã bị hủy.`
            }
            : {
              status: 'error',
              title: 'Thanh toán không thành công',
              subTitle: `Giao dịch ${orderCode} đã thất bại.`
            };
        }

        setResultProps(finalResult);
      } catch (err) {
        console.error(err);
        setResultProps({
          status: 'error',
          title: 'Lỗi hệ thống',
          subTitle: 'Không thể xử lý giao dịch ngay bây giờ.'
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);

  return (
    <BasePages className="relative mx-auto w-[80%] flex-1 p-4">
      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        resultProps && (
          <Result
            status={resultProps.status}
            title={resultProps.title}
            subTitle={resultProps.subTitle}
          />
        )
      )}
      <span
            onClick={() => router.push('/profile/orders')}
            className="block mt-4 text-center font-monsterrat cursor-pointer text-base text-[#4E4663] underline"
          >
            Xem đơn hàng của bạn
          </span>
    </BasePages>
  );
}
