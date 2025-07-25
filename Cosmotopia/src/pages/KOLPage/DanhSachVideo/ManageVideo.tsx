import { Button, Card, ConfigProvider, Form, Input, message, Popconfirm, Row, Spin, Table } from 'antd';
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { FC, useEffect, useState } from 'react';
import { getAllVideos, deleteVideo } from '@/queries/affilate.api';
import { getDetailProduct } from '@/queries/affilate.api'; // Giả sử bạn có một hook để lấy chi tiết sản phẩm
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

interface ManageVideoProps { }

export const ManageVideo: FC<ManageVideoProps> = ({ }) => {
  const [dataTable, setDataTable] = useState<null | any[]>(null);
  const [valueSearch, setValueSearch] = useState<string>('');
  const { Search } = Input;
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });

  const columns = [
    { title: 'Link video', dataIndex: 'videoUrl', key: 'videoUrl' },
    { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
    { title: 'Tiêu đề video', dataIndex: 'title', key: 'title' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (date) => dayjs(date).format('DD/MM/YYYY') },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'status',
      render: (status) => (
        <>{status ? 'Hoạt động' : 'Ngưng hoạt động'}</>
      ),
    },
    {
      title: 'Hành động', key: 'action', render: (record) => (
        <div>
          <Link to={`/video/${record.videoId}`} style={{ marginRight: 8 }}>
            <Button type="default" icon={<EditOutlined />}>Edit</Button>
          </Link>
          <Popconfirm title="Xóa video?" onConfirm={() => handleDeleteVideo(record.videoId)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      )
    },
  ];

  useEffect(() => {
    getData(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const getData = (current: number, pageSize: number) => {
    // Start loading the data
    // message.loading('Đang tải dữ liệu...');

    // Fetch all videos
    getAllVideos(current, pageSize)
      .then((response) => {
        // Store the original video data
        const videos = response;

        // Step 1: Create an array of promises that fetch product details for each video
        const updatedDataPromises = videos.map((video: any) => {
          const productId = video.productId || video.product?.productId;

          console.log('Product ID:', productId);

          // Return a promise to get product details
          return getDetailProduct(productId)
            .then((productResponse) => {
              console.log('Product details:', productResponse);

              // Update the video object with product name
              return {
                ...video,
                productName: productResponse.data.name || 'Không có tên sản phẩm',
              };
            })
            .catch((error) => {
              console.error('Error fetching product details:', error);
              // If there's an error fetching product details, assign a default value
              return {
                ...video,
                productName: 'Không tìm thấy sản phẩm',
              };
            });
        });

        // Step 2: Use Promise.all to wait for all promises to resolve
        Promise.all(updatedDataPromises)
          .then((updatedVideos) => {
            // After all videos are updated, set the final data to state
            setDataTable(updatedVideos);
            setPagination((prev) => ({ ...prev, total: response.totalCount }));
            message.success('Dữ liệu đã được tải thành công!');
          })
          .catch((error) => {
            console.error('Error updating videos with product details:', error);
            setDataTable([]);
            message.error('Lỗi khi cập nhật dữ liệu!');
          });
      })
      .catch((error) => {
        console.log(error);
        setDataTable([]);
        message.error('Lỗi khi tải dữ liệu!');
      });
  };

  const handleDeleteVideo = (videoId: string) => {
    deleteVideo(videoId)
      .then(() => {
        message.success('Video đã được xóa thành công!');
        getData(pagination.current, pagination.pageSize);
      })
      .catch((error) => {
        message.error('Lỗi khi xóa video!');
      });
  };

  const onSearch = (value: string) => {
    setValueSearch(value.length > 0 ? value : null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 16px' }}>
        <h1 style={{ color: '#A020F0', fontWeight: 'bold', fontSize: '32px' }}>Quản lý Video</h1>
        <Search placeholder="Tìm kiếm video" onSearch={onSearch} enterButton style={{ maxWidth: '600px' }} />
      </div>

      {!dataTable ? (
        <Spin size="large" fullscreen />
      ) : (
        <Table
          dataSource={valueSearch ? dataTable.filter((item) => item.title.toUpperCase().includes(valueSearch.toUpperCase())) : dataTable}
          columns={columns}
          pagination={pagination}
          style={{ marginTop: '24px' }}
        />
      )}
    </div>
  );
};
