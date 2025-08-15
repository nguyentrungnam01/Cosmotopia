import {
  AddProduct,
  getAllBrand,
  getAllCategory,
  getAllProduct,
  getProductDetail,
  UpdateProduct
} from '@/queries/dashboard/dashboardAdmin.query';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  Upload
} from 'antd';
import React, { FC, useEffect, useState } from 'react';
interface ProductProps {}

export const Product: FC<ProductProps> = ({}) => {
  const [dataTable, setDataTable] = useState<null | any[]>(null);
  const [category, setCategory] = useState<null | any[]>(null);
  const [brand, setBrand] = useState<null | any[]>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [valueSearch, setValueSearch] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);
  const { Search } = Input;
  const [productId, setProductId] = useState<string>('');
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });
  const handleTableChange = (pagination) => {
    console.log(pagination);
    setPagination(pagination);
  };
  const columns = [
    // {
    //   title: 'ProductID',
    //   dataIndex: 'productId',
    //   key: 'productId',
    //   render: (n, o) => {
    //     return <>{n ? n : '-'}</>;
    //   }
    // },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (n, o) => {
        return <>{n ? n : '-'}</>;
      }
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      render: (n, o) => {
        return <>{n ? n.name : '-'}</>;
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (n, o) => {
        return <>{n ? n : '-'}</>;
      }
    },

    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
      // render: (n, o) => {
      //   return <>{getRole(n)}</>;
      // },
    },
    {
      title: 'StockQuantity',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity'
      // render: (n, o) => {
      //   return <>{getRole(n)}</>;
      // },
    },
    {
      title: 'Edit',
      key: 'action',
      render: (record) => (
        <Button
          type="default"
          // disabled={
          //   record.admin_approve != "0" && user.role != 0 ? true : false
          // }
          onClick={() => {
            showModal(record.productId);
            console.log(record);
            // SIdCampaign.set(record.id);
          }}
        >
          Edit
        </Button>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (n, o) => {
        return <>{n ? 'Active' : 'Locked'}</>;
      }
    }
  ];
  const props = {
    name: 'file',
    // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    // headers: {
    //   authorization: 'authorization-text'
    // },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };
  const customUpload = async ({ file, onSuccess, onError }) => {
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Cometis');
    formData.append('cloud_name', 'dhylbhwvb');
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dhylbhwvb/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    const data = await response.json();
    console.log(data.secure_url);
    setFileList((prev) => [
      ...prev,
      {
        uid: data.asset_id,
        status: 'done',
        url: data.secure_url
      }
    ]);

    // try {
    //   const response = await axios.post(
    //     'https://your-api.com/upload',
    //     formData,
    //     {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     }
    //   );
    //   onSuccess(response.data); // Báo cho AntD biết upload thành công
    // } catch (error) {
    //   onError(error); // Báo lỗi nếu có
    // }
  };

  const showModal = (id) => {
    setProductId(id);
  };

  const handleCancel = () => {
    setProductId('');
    form.resetFields();
    setFileList([]);
  };
  const handlePreview = async (file) => {
    setPreviewImage(file.url);
    setPreviewOpen(true);
  };
  useEffect(() => {
    if (productId.length > 1) {
      getProductDetail(productId).then((data) => {
        const dataCurrent = data?.data;
        // console.log(dataCurrent);
        form.setFieldsValue({
          // image :

          description: dataCurrent.description,
          stockQuantity: dataCurrent.stockQuantity,
          price: dataCurrent.price,
          brand: dataCurrent.brand?.brandId,
          commissionRate: dataCurrent.commissionRate,
          category: dataCurrent.category?.categoryId,
          name: dataCurrent.name,
          isActive: dataCurrent.isActive || false
        });
        const newFileList = dataCurrent.imageUrls?.map((url, index) => ({
          uid: index,
          url: url,
          status: 'done'
        }));
        setFileList(newFileList);
      });
    }
  }, [productId]);

  const addData = (model) => {
    AddProduct(model)
      .then((data) => {
        // console.log(data);
        message.success('add new Product success!!!');
        handleCancel();
        getData();
      })
      .catch((error) => {
        console.log(error);
        message.error(error.response?.data?.msg);
      });
  };
  const updateData = (model) => {
    UpdateProduct(model, productId)
      .then((data) => {
        console.log(data);
        message.success('update Product success!!!');
        handleCancel();
        getData();
      })
      .catch((error) => {
        console.log(error);
        message.error(error.response?.data?.msg);
      });
  };
  const onFinish = async (values) => {
    const listImage = fileList.map((file) => file.url);
    // console.log(listImage);
    // console.log(values);
    const model = {
      name: values.name,
      description: values.description,
      price: values.price,
      stockQuantity: values.stockQuantity,
      commissionRate: values.commissionRate,
      categoryId: values.category,
      brandId: values.brand,
      imageUrls: listImage,
      isActive: values.isActive
    };
    productId.length > 1 ? updateData(model) : addData(model);
  };
  const getData = (Parampage?, PrampageSize?) => {
    const page = Parampage ?? 1;
    const pageSize = PrampageSize ?? 8;

    console.log(page, pageSize);
    getAllProduct(page, pageSize, '')
      .then((data) => {
        console.log(data);
        setDataTable(data?.products);
        setPagination((prev) => ({ ...prev, total: data?.totalCount }));
      })
      .catch((error) => {
        console.log(error);
        setDataTable([]);
      })
      .finally(() => {});
  };
  const getCategory = () => {
    getAllCategory()
      .then((data) => {
        setCategory(data?.categories);
      })
      .catch((error) => {
        console.log(error);
        setDataTable([]);
      })
      .finally(() => {});
  };
  const getBrand = () => {
    getAllBrand()
      .then((data) => {
        setBrand(data?.brands);
      })
      .catch((error) => {
        console.log(error);
        setDataTable([]);
      })
      .finally(() => {});
  };
  const onSearch = (value, _e, info) => {
    setValueSearch(value.length > 0 ? value : '');
  };

  useEffect(() => {
    getData();
    getCategory();
    getBrand();
  }, []);
  // useEffect(() => {
  //   setPagination((prev) => ({ ...prev, current: 1 }));
  // }, [valueSearch]);
  useEffect(() => {
    // console.log('oke');
    getData(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0px 16px'
        }}
      >
        <h1 style={{ fontSize: '32px', color: '#FF9538' }}>Manage Product</h1>
        <Search
          placeholder="Search Name Product"
          onSearch={onSearch}
          enterButton
          style={{ maxWidth: '600px' }}
        />
        <div>
          <Modal
            title={`${productId?.length > 1 ? 'Update' : 'Add New'}  Product`}
            visible={productId.length > 0 ? true : false}
            onCancel={handleCancel}
            width={1000}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,

              <Button
                type="primary"
                onClick={() => {
                  form.submit();
                }}
              >
                {` ${productId?.length > 1 ? 'Update' : 'Add New'} Product`}
              </Button>
            ]}
          >
            <div style={{ width: '100%', margin: 'auto' }}>
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item
                          name="name"
                          label="Name"
                          rules={[
                            {
                              required: true,
                              message: 'Please Enter Name of Product!'
                            }
                          ]}
                        >
                          <Input placeholder="Enter Name Product" />
                        </Form.Item>
                      </Col>
                    </Row>
                    {/* <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item
                          name="dateRange"
                          label="Date Range"
                          rules={[
                            {
                              required: true,
                              message:
                                'Please select the date range for the campaign!'
                            }
                          ]}
                        >
                          <DatePicker.RangePicker
                            style={{ width: '100%' }}
                            placeholder={[
                              'Select Start Date',
                              'Select End Date'
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row> */}
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          name="category"
                          label="Category"
                          rules={[
                            {
                              required: true,
                              message: 'Please Enter Category of Product!'
                            }
                          ]}
                        >
                          <Select
                            // defaultValue="lucy"
                            style={{
                              width: '100%'
                            }}
                            // onChange={handleChange}
                            options={category?.map((option) => ({
                              value: option.categoryId,
                              label: option.name
                            }))}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="brand"
                          label="Brand"
                          rules={[
                            {
                              required: true,
                              message: 'Please Enter Brand of Product!'
                            }
                          ]}
                        >
                          {/* <InputNumber
                            prefix="VND"
                            style={{ width: '100%' }}
                            placeholder="Enter Price of Product"
                          /> */}
                          <Select
                            // defaultValue="lucy"
                            style={{
                              width: '100%'
                            }}
                            // onChange={handleChange}
                            options={brand?.map((option) => ({
                              value: option.brandId,
                              label: option.name
                            }))}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          name="price"
                          label="Price"
                          rules={[
                            {
                              required: true,
                              message: 'Please Enter Price of Product!'
                            }
                          ]}
                        >
                          <InputNumber
                            prefix="VND"
                            style={{ width: '100%' }}
                            placeholder="Enter Price of Product"
                            // onChange={(text) => text?.toLocaleString('vi-VN')}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="stockQuantity"
                          label="StockQuantity"
                          rules={[
                            {
                              required: true,
                              message: 'Please Enter StockQuantity of Product!'
                            }
                          ]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            placeholder="Enter StockQuantity of Product"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          name="commissionRate"
                          label="Commission Rate"
                          rules={[
                            {
                              required: true,
                              message:
                                'Please Enter Commission Rate of Product!'
                            }
                          ]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            placeholder="Enter Commission Rate of Product"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="isActive"
                          label="Status"
                          rules={[
                            {
                              required: true,
                              message: 'Please Enter status of Product!'
                            }
                          ]}
                        >
                          <Select
                            // defaultValue="lucy"
                            style={{
                              width: '100%'
                            }}
                            // onChange={handleChange}
                            options={[
                              {
                                value: false,
                                label: 'Locked'
                              },
                              {
                                value: true,
                                label: 'Active'
                              }
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item
                          name="description"
                          label="Description"
                          rules={[
                            {
                              required: true,
                              message:
                                'Please Enter Description of New Campaign!'
                            }
                          ]}
                        >
                          <Input.TextArea
                            placeholder="Enter Description Campaign"
                            rows={4}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name="image"
                      label="Image"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please Enter Description of New Campaign!'
                      //   }
                      // ]}
                    >
                      <Upload
                        multiple
                        fileList={fileList}
                        onPreview={handlePreview}
                        listType="picture-card"
                        onRemove={(file) => {
                          setFileList((prev) =>
                            prev.filter((item) => item.uid !== file.uid)
                          );
                        }}
                        accept=".jpg,.png,.pdf"
                        // showUploadList={true}
                        // beforeUpload={(file) => {
                        //   setFileList((prev) => [...prev, file]);
                        //   return false; // Ngăn Ant Design tự động upload
                        // }}
                        // fileList={fileList}
                        // onRemove={(file) => {
                        //   setFileList((prev) =>
                        //     prev.filter((item) => item.uid !== file.uid)
                        //   );
                        // }}
                        customRequest={customUpload}
                      >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                      </Upload>
                      {previewImage && (
                        <Image
                          wrapperStyle={{
                            display: 'none'
                          }}
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) =>
                              setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                              !visible && setPreviewImage('')
                          }}
                          src={previewImage}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                {/*  */}
              </Form>
            </div>
          </Modal>
          <Button
            onClick={() => {
              showModal('0');
            }}
            className="no-tailwind"
            type="primary"
          >
            Add new Product
          </Button>
        </div>
        {/* <AddNewAccount GetProfileFunction={getProfile}></AddNewAccount> */}
      </div>
      {!dataTable ? (
        <Spin
          size="large"
          // style={{
          //   width: "100%",
          //   marginTop: "150px",
          // }}
          fullscreen
        ></Spin>
      ) : (
        <Table
          dataSource={
            valueSearch
              ? dataTable.filter((a) =>
                  a?.name?.toUpperCase().includes(valueSearch.toUpperCase())
                )
              : dataTable
          }
          onChange={handleTableChange}
          columns={columns}
          pagination={pagination}
          style={{ marginTop: '24px' }}
          // onChange={onChangePaging}
        />
      )}
    </div>
  );
};
