import { Button, Card, ConfigProvider, Form, Input, message, Space } from 'antd';
import { FC, useState } from 'react';
import { generateVideo } from '@/queries/affilate.api';  
import { getProductDetail } from '@/queries/dashboard/dashboardAdmin.query';

interface CreateVideoProps { }

export const CreateVideo: FC<CreateVideoProps> = ({ }) => {
    const [form] = Form.useForm();
    const [productSelected, setProductSelected] = useState(null);
    const [linkShare, setLinkShare] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);  

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

    const onFinish = async (values) => {
        if (!productSelected) {
            message.error('Bạn phải chọn sản phẩm trước khi tạo video');
            return;
        }

        if (!videoFile) {
            message.error('Bạn phải tải lên video!');
            return;
        }

        const videoData = {
            Title: values.Title,
            Description: values.Description,
            VideoFile: videoFile,
            ProductId: productSelected.productId,
        };

        try {
            setLoading(true);  // Bắt đầu quá trình tải
            console.log('Video data:', videoData);
            const response = await generateVideo(videoData);
            console.log('Video created successfully:', response);
            setLinkShare(response?.url);  // Set URL video để hiển thị

            // Thêm thông báo thành công
            message.success('Video đã được tạo thành công!');  // Thông báo thành công
        } catch (error) {
            message.error('Lỗi khi tạo video!');
        } finally {
            setLoading(false);  // Kết thúc quá trình tải
        }
    };

    return (
        <div>
            <h2 className="mb-4 text-lg font-semibold">Tạo Video Affiliate</h2>

            {/* Nhập URL sản phẩm */}
            <Form.Item
                name="url"
                className="mb-0"
                rules={[{ required: true, message: 'Please Enter link of Products!' }]}>
                <Input.Search
                    placeholder="Dán link sản phẩm"
                    className="h-10"
                    onSearch={onSearch}
                />
            </Form.Item>

            {/* Form để nhập tiêu đề, mô tả và tải lên video */}
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item
                    label="Tiêu đề"
                    name="Title"
                    rules={[{ required: true, message: 'Tiêu đề là bắt buộc!' }]}>
                    <Input placeholder="Nhập tiêu đề video" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="Description"
                    rules={[{ required: true, message: 'Mô tả là bắt buộc!' }]}>
                    <Input.TextArea placeholder="Nhập mô tả video" />
                </Form.Item>

                {/* Tải lên video */}
                <Form.Item label="Tải lên Video" name="VideoFile" rules={[{ required: true, message: 'Vui lòng chọn video!' }]}>
                    <input
                        type="file"
                        accept=".mp4,.mov,.avi,.mkv,.webm"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                    />
                </Form.Item>

                {/* Thông tin sản phẩm */}
                {productSelected ? (
                    <Card style={{ margin: '16px 0', textAlign: 'left' }} cover={<img src={productSelected?.imageUrls[0]} alt={productSelected?.name} style={{ height: '200px', width: '200px' }} />}>
                        <div>
                            <div>
                                <h3>{productSelected?.name}</h3>
                                <p>
                                    Giá: {productSelected?.price.toLocaleString('vi-VN')} VND
                                </p>
                            </div>
                            <div className="mt-2 text-base font-bold text-green-600">
                                Hoa hồng {productSelected.commissionRate} %
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card>
                        <p className="mt-2">Dán link vào để hiển thị sản phẩm</p>
                    </Card>
                )}

                {/* Nút tạo video */}
                <ConfigProvider
                    theme={{
                        components: {
                            Button: {
                                colorPrimary: 'linear-gradient(to right, #A933FF, #7000FF)',
                                colorPrimaryHover: 'linear-gradient(to right, #A933FF, #7000FF)',
                            },
                        },
                    }}>
                    <Button
                        disabled={!productSelected || !videoFile || loading}
                        htmlType="submit"
                        type="primary"
                        className="mb-4 h-10 w-full rounded-full bg-gradient-to-r from-[#A933FF] to-[#7000FF] text-base font-semibold text-white">
                        {loading ? 'Đang tạo Video...' : 'Tạo Video'}
                    </Button>
                </ConfigProvider>

                {/* Link video + chia sẻ */}
                {/* <Form.Item name="link">
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
                            onClick={() => {
                                if (linkShare) {
                                    navigator.clipboard.writeText(linkShare);
                                    message.success('Đã sao chép liên kết vào clipboard!');
                                }
                            }}>
                            Copy
                        </Button>
                    </Space.Compact>
                </Form.Item> */}
            </Form>
        </div>
    );
};
