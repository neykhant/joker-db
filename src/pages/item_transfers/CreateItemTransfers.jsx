import React, { useEffect, useState } from "react";
import {
  Space,
  Typography,
  Form,
  Button,
  InputNumber,
  Select,
  Table,
  message,
  Spin,
} from "antd";
import Layout from "antd/lib/layout/layout";
import {
  EditOutlined,
  SaveOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { getShops, getStocks, createItemTransfer } from "../../store/actions";
import { successCreateMessage } from "../../util/messages";

const { Title, Text } = Typography;
const { Option } = Select;

const CreateItemTransfers = ({
  status,
  error,
  auth,
  stock,
  getStocks,
  shop,
  getShops,
  createItemTransfer,
}) => {
  const [itemTransfers, setItemTransfers] = useState([]);
  const [shopId, setShopId] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      await getStocks();
      await getShops();
    };

    fetchData();
    return () => fetchData();
  }, [getShops, getStocks]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  useEffect(() => {
    if (status.success) {
      setItemTransfers([]);
      setShopId(null);
      message.success(successCreateMessage);
    }

    return () => status.success;
  }, [form, status.success]);

  const onFinish = (values) => {
    const findStock = stock.stocks.find(
      (stock) => stock.id === values.stock_id
    );
    if (values.quantity === 0 || findStock.quantity < values.quantity) {
      message.error("လက်ကျန်ပမာဏထက်များနေပါသည်။");
    } else {
      setItemTransfers([
        ...itemTransfers,
        {
          ...values,
          stock: findStock,
          key: itemTransfers.length + 1,
        },
      ]);
      form.resetFields();
    }
  };

  const onChange = (value) => {
    if (value === undefined) {
      setShopId(null);
    } else {
      setShopId(value);
    }
  };

  const handleDelete = (record) => {
    const filterItemTransfers = itemTransfers.filter(
      (itemTransfer) => itemTransfer !== record
    );
    const transformItemTransfers = filterItemTransfers.map(
      (itemTransfer, index) => {
        return {
          ...itemTransfer,
          key: index + 1,
        };
      }
    );
    setItemTransfers(transformItemTransfers);
  };

  const handleSave = async () => {
    if (shopId === null) {
      message.error("ကျေးဇူးပြု၍ ဆိုင်အမည်ထည့်ပါ");
    } else if (itemTransfers.length === 0) {
      message.error("ကျေးဇူးပြု၍ လွဲရန်ထည့်ပါ");
    } else {
      const singleItemTransfers = itemTransfers.map((itemTransfer) => {
        return {
          stock_id: itemTransfer.stock_id,
          quantity: itemTransfer.quantity,
        };
      });

      const saveItemTransfer = {
        item_transfers: singleItemTransfers,
        to_shop_id: shopId,
      };

      await createItemTransfer(saveItemTransfer);
    }
  };

  const columns = [
    {
      title: "ပစ္စည်းအမည်",
      dataIndex: "stock",
      render: (stock) =>
        `${stock.item?.item_name?.name}(${stock.item?.size})(${stock.item?.color})`,
    },
    {
      title: "အရေအတွက်",
      dataIndex: "quantity",
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleDelete(record)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title style={{ textAlign: "center" }} level={3}>
            ပစ္စည်းလွဲပြောင်းရန်
          </Title>
          <Space
            direction="horizontal"
            style={{
              width: "100%",
              justifyContent: "center",
              marginBottom: "10px",
            }}
            size="large"
          >
            <Text type="secondary">ဆိုင်အမည်ရွေးပါ</Text>
            <Select
              showSearch
              placeholder="ကျေးဇူးပြု၍ ဆိုင်အမည်ရွေးပါ"
              optionFilterProp="children"
              onChange={onChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              allowClear={true}
              size="large"
              style={{ borderRadius: "10px" }}
            >
              {shop.shops
                .filter((shop) => shop.id !== auth.user?.shop?.id)
                .map((shop) => (
                  <Option value={shop.id} key={shop.id}>
                    {shop.name}
                  </Option>
                ))}
            </Select>
          </Space>
          <Form
            labelCol={{
              xl: {
                span: 3,
              },
            }}
            wrapperCol={{
              xl: {
                span: 24,
              },
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              name="stock_id"
              label="ပစ္စည်းအမည်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ပစ္စည်းအမည်ရွေးပါ",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="ကျေးဇူးပြု၍ ပစ္စည်းအမည်ရွေးပါ"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                allowClear={true}
                size="large"
                style={{ borderRadius: "10px" }}
              >
                {stock.stocks.map((stock) => (
                  <Option
                    value={stock.id}
                    key={stock.id}
                  >{`${stock.item?.item_name?.name}(${stock.item?.size})(${stock.item?.color})(${stock.quantity})`}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label="အရေအတွက်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ အရေအတွက်ထည့်ပါ",
                },
              ]}
            >
              <InputNumber
                placeholder="အရေအတွက်ထည့်ပါ"
                prefix={<EditOutlined />}
                style={{ borderRadius: "10px", width: "100%" }}
                size="large"
              />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button
                style={{
                  backgroundColor: "var(--secondary-color)",
                  color: "var(--white-color)",
                  borderRadius: "10px",
                }}
                size="large"
                htmlType="submit"
              >
                <PlusSquareOutlined />
                အသစ်ထည့်မည်
              </Button>
            </Form.Item>
          </Form>
          <Table
            bordered
            columns={columns}
            dataSource={itemTransfers}
            pagination={{ position: ["none", "none"] }}
          />
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
          >
            <Button
              style={{
                backgroundColor: "var(--primary-color)",
                color: "var(--white-color)",
                borderRadius: "10px",
              }}
              size="large"
              onClick={handleSave}
            >
              <SaveOutlined />
              သိမ်းမည်
            </Button>
          </Space>
        </Space>
      </Layout>
    </Spin>
  );
};

const mapStateToProps = (store) => ({
  status: store.status,
  error: store.error,
  auth: store.auth,
  shop: store.shop,
  stock: store.stock,
});

export default connect(mapStateToProps, {
  getShops,
  getStocks,
  createItemTransfer,
})(CreateItemTransfers);
