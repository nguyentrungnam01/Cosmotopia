import BasePages from '@/components/shared/base-pages.js';
import OrderInfo from './OrderInfo';
import { MapPin } from 'lucide-react';
import PaymentMethods from './PaymentMethod';
import { getAccountSelf } from '@/queries/user.api';
import { usePostOrder, useCreatePaymentLink } from '@/queries/user.api';
import { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Select, Spin } from 'antd';
import { dataAddressJSOn } from '@/store/dataAddress';
import { useLocation } from 'react-router-dom';
import { sSpin } from '@/store/spin';

export default function Payment() {
  const location = useLocation();
  const products = location.state as any[];

  // React-Query mutations
  const postOrderMutation = usePostOrder();
  const createLinkMutation = useCreatePaymentLink();

  const [user, setUser] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [address, setAddress] = useState({
    district: 'Thành phố Thủ Đức',
    ward: 'Phường Long Thạnh Mỹ',
    house: 'VinHome s10.02'
  });
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const textAddress = `${address.house}, ${address.ward}, ${address.district}, TPHCM`;

  const handlePlaceOrder = async () => {
    sSpin.set(true);
    try {
      const orderPayload = {
        orderDetails: products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity
        })),
        address: textAddress,
        paymentMethod: 'Credit Card'
      };
      const order = await postOrderMutation.mutateAsync(orderPayload);
      console.log(order);

      const modelPayment = {
        orderId: order?.orderId,
        amount: order?.totalAmount,
        returnUrl: '',
        paymentMethod: 'PayOS'
      }

      const payment = await createLinkMutation.mutateAsync(modelPayment);

      console.log("Payment Detail: ", payment);

      //Redirect
      window.location.href = payment.paymentUrl;
    } catch (err: any) {
      console.error(err);
      message.error(
        err?.message ||
        'Có lỗi xảy ra khi tạo đơn hoặc chuyển sang PayOS.'
      );
    } finally {
      sSpin.set(false);
    }
  };

  useEffect(() => {
    getAccountSelf()
      .then(({ data }) => setUser(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(address);
      setSelectedDistrict(address.district);
      setSelectedWard(address.ward);
    }
  }, [visible]);

  const onFinishAddress = (vals: any) => {
    setAddress(vals);
    setVisible(false);
  };
  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const isLoading =
    postOrderMutation.isLoading || createLinkMutation.isLoading;

  return (
    <BasePages className="relative mx-auto max-h-screen w-[80%] p-4">
      <h2 className="mb-8 ml-4 font-montserrat text-3xl font-bold text-[#3D3D3D]">
        Xem trước thông tin đơn hàng
      </h2>

      <div className="mb-8 flex w-full items-start justify-between gap-10">
        <div className="flex w-2/5 min-w-[400px] flex-col gap-5">
          <OrderInfo />
        </div>

        <div className="flex w-4/5 flex-col gap-5">
          {/* Địa chỉ */}
          <div className="flex rounded-md bg-white p-5 shadow-lg">
            <div className="flex w-full flex-col">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[#4E4663]" />
                <span className="font-montserrat text-2xl text-[#4E4663]">
                  Địa chỉ
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-montserrat text-xl text-[#4E4663]">
                    {user
                      ? `${user.firstName} ${user.lastName} – ${user.phone}`
                      : '…'}
                  </h3>
                  <p className="font-montserrat text-base text-[#837D92]">
                    {textAddress}
                  </p>
                </div>
                <button
                  className="font-montserrat text-lg text-[#936EFF]"
                  onClick={() => setVisible(true)}
                >
                  Thay đổi
                </button>
              </div>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="flex rounded-md bg-white p-5 shadow-lg">
            <PaymentMethods ConfirmPayMent={handlePlaceOrder} />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-4">
          <Spin />
        </div>
      )}

      {/* Modal chọn địa chỉ */}
      <Modal
        title="Chọn địa chỉ"
        open={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Xác nhận
          </Button>
        ]}
      >
        <Form layout="vertical" form={form} onFinish={onFinishAddress}>
          <Form.Item label="Thành phố">
            <Select disabled value="TPHCM" />
          </Form.Item>

          <Form.Item
            name="district"
            label="Quận/Huyện"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Chọn quận/huyện"
              onChange={(val) => {
                setSelectedDistrict(val);
                form.setFieldValue('ward', null);
              }}
            >
              {dataAddressJSOn.districts.map((d) => (
                <Select.Option key={d.code} value={d.name}>
                  {d.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="ward"
            label="Phường/Xã"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Chọn phường/xã"
              disabled={!selectedDistrict}
            >
              {selectedDistrict &&
                dataAddressJSOn.districts
                  .find((d) => d.name === selectedDistrict)!
                  .wards.map((w) => (
                    <Select.Option key={w.code} value={w.name}>
                      {w.name}
                    </Select.Option>
                  ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="house"
            label="Số nhà, đường"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nhập số nhà, tên đường" />
          </Form.Item>
        </Form>
      </Modal>
    </BasePages>
  );
}
