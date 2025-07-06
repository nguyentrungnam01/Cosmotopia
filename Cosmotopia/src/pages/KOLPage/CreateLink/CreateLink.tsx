import { generalLink } from '@/queries/affilate.api';
import { getProductDetail } from '@/queries/dashboard/dashboardAdmin.query';
import { ShareAltOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  ConfigProvider,
  Form,
  Input,
  message,
  Space
} from 'antd';
import { link } from 'fs';
import React, { FC, useState } from 'react';

interface CreateLinkProps {}

export const CreateLink: FC<CreateLinkProps> = ({}) => {
  const [form] = Form.useForm();
  const [productSelected, setProductSelected] = useState(null);
  const [linkShare, setLinkShare] = useState(null);
  const handleShare = async () => {
    if (!linkShare) {
      return;
    }
    try {
      await navigator.clipboard.writeText(linkShare);
      message.success('Đã sao chép vào clipboard!');
    } catch (err) {
      message.error('Lỗi khi sao chép!');
    }
  };
  const onSearch = (value) => {
    const segments = value.split('/');
    const productId = segments[segments.length - 1];
    getProductDetail(productId)
      .then((data) => {
        console.log(data);
        setProductSelected(data?.data);
      })
      .catch((err) => {
        setProductSelected(null);
        message.error('Không tìm thấy sản phẩm từ link');
      });
  };
  const onFinish = (values) => {
    if (productSelected == null) {
      message.error('Bạn phải chọn sản phẩm trước khi tạo link');
      return;
    }
    console.log(values);

    const productId = productSelected.productId;
    console.log(productId);
    // const model = {
    //   productId: productId
    // };
    generalLink(productId)
      .then((data) => {
        console.log(data);
        const url = data?.data.affiliateProductUrl.replace(
          'yourdomain.com',
          // 'cosmotopia.vercel.app'
          'localhost:3000'
        );
        setLinkShare(url);
        // form.setFieldValue('link', setdata)
      })
      .catch((err) => {
        message.error(err.message);
        // console.log(err);
      })
      .finally(() => {});
  };
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Tạo liên kết affiliate</h2>
      <Form.Item
        name="url"
        className="mb-0"
        rules={[
          {
            required: true,
            message: 'Please Enter link of Products!'
          }
        ]}
      >
        <Input.Search
          placeholder="Dán link sản phẩm"
          className="h-10"
          onSearch={onSearch}
        />
      </Form.Item>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* Nhập link sản phẩm */}

        {/* <div className="mb-2 mt-0 cursor-pointer text-right text-sm text-gray-500 hover:underline">
          Chọn sản phẩm từ trang web
        </div> */}
        {/* Nút tạo link */}
        <div style={{ minHeight: '200px' }}>
          {productSelected ? (
            <Card
              style={{ margin: '16px 0', textAlign: 'left' }}
              cover={
                <img
                  src={productSelected?.imageUrls[0]}
                  alt={productSelected?.name}
                  style={{ height: '200px', width: '200px' }}
                />
              }
            >
              <div>
                <div>
                  <h3>{productSelected?.name}</h3>
                  <p>
                    Giá: {productSelected?.price.toLocaleString('vi-VN')} VND{' '}
                  </p>
                </div>
                <div className="mt-2 text-base font-bold text-green-600">
                  Hoa hồng {productSelected.commissionRate} %
                </div>
              </div>
            </Card>
          ) : (
            <>
              <Card>
                <p className="mt-2">Dán link vào để hiển thị sản phẩm</p>
              </Card>
            </>
          )}
        </div>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: 'linear-gradient(to right, #A933FF, #7000FF)', // Giữ màu gradient
                colorPrimaryHover: 'linear-gradient(to right, #A933FF, #7000FF)' // Chặn màu đỏ khi hover
              }
            }
          }}
        >
          <Button
            disabled={!productSelected}
            htmlType="submit"
            type="primary"
            className="mb-4 h-10 w-full rounded-full bg-gradient-to-r from-[#A933FF] to-[#7000FF] text-base font-semibold text-white"
          >
            Tạo link
          </Button>
        </ConfigProvider>

        {/* Link affiliate + nút chia sẻ */}
        <Form.Item name="link">
          <Space.Compact className="w-full">
            <Input
              placeholder="Link sẽ hiển thị sau khi tạo"
              readOnly
              disabled={!linkShare}
              value={linkShare || ''}
            />
            <Button
              icon={<ShareAltOutlined />}
              className="h-10"
              onClick={handleShare}
            >
              Copy
            </Button>
          </Space.Compact>
        </Form.Item>
      </Form>
    </div>
  );
};
