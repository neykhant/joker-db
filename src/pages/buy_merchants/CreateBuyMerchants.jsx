import React, { useEffect, useState } from "react";
import dateFormat from "dateformat";
import {
  Space,
  Typography,
  Form,
  Button,
  InputNumber,
  Select,
  Table,
  Row,
  Col,
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
import { getMerchants, getItems, createPurchase } from "../../store/actions";
import { successCreateMessage } from "../../util/messages";

const { Title, Text } = Typography;
const { Option } = Select;

const CreateBuyMerchants = ({
  status,
  error,
  merchant,
  getMerchants,
  item,
  getItems,
  createPurchase,
}) => {
  const [buys, setBuys] = useState([]);
  const [credit, setCredit] = useState(0);
  const [paid, setPaid] = useState(null);
  const [merchantId, setMerchantId] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      await getMerchants();
      await getItems();
    };

    fetchData();
    return () => fetchData();
  }, [getMerchants, getItems]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  useEffect(() => {
    if (status.success) {
      setPaid(null);
      setCredit(0);
      setMerchantId(null);
      setBuys([]);
      message.success(successCreateMessage);
    }

    return () => status.success;
  }, [form, status.success]);

  const onFinish = (values) => {
    const findItem = item.items.find((item) => item.id === values.item_id);

    setBuys([
      ...buys,
      {
        ...values,
        item: findItem,
        subtotal: values.quantity * values.price,
        key: buys.length + 1,
      },
    ]);
    form.resetFields();
  };

  const onChange = (value) => {
    if (value === undefined) {
      setMerchantId(null);
    } else {
      setMerchantId(value);
    }
  };

  const buyTotal =
    buys.length > 0
      ? buys.map((buy) => buy.subtotal).reduce((a, b) => a + b)
      : 0;

  const handlePayment = (value) => {
    setCredit(buyTotal - value);
    setPaid(value);
  };

  const handleDelete = (record) => {
    const filterBuys = buys.filter((buy) => buy !== record);
    const transformBuys = filterBuys.map((buy, index) => {
      return {
        ...buy,
        key: index + 1,
      };
    });
    setBuys(transformBuys);
    setCredit(0);
  };

  const handleSave = async () => {
    if (merchantId === null) {
      message.error("ကျေးဇူးပြု၍ ကုန်သည်အချက်အလက်ထည့်ပါ");
    } else if (buys.length === 0) {
      message.error("ကျေးဇူးပြု၍ ဝယ်ရန်ထည့်ပါ");
    } else if (paid === null) {
      message.error("ကျေးဇူးပြု၍ ပေးငွေထည့်ပါ");
    } else {
      const purchaseItems = buys.map((buy) => {
        return {
          item_id: buy.item_id,
          quantity: buy.quantity,
          price: buy.price,
          subtotal: buy.subtotal,
        };
      });

      const wholeTotal =
        buys.length > 0
          ? buys.map((buy) => buy.subtotal).reduce((a, b) => a + b)
          : 0;

      const now = new Date();
      const date = dateFormat(now, "yyyy-mm-dd");

      const saveBuy = {
        date: date,
        purchase_items: purchaseItems,
        merchant_id: merchantId,
        whole_total: wholeTotal,
        paid: paid,
        credit: credit,
      };

      await createPurchase(saveBuy);
    }
  };

  const columns = [
    {
      title: "ပစ္စည်းအမည်",
      dataIndex: "item",
      render: (item) => `${item.item_name?.name}(${item.size})(${item.color})`,
    },
    {
      title: "အရေအတွက်",
      dataIndex: "quantity",
    },
    {
      title: "တစ်ခုဈေးနှုန်း",
      dataIndex: "price",
    },
    {
      title: "စုစုပေါင်းပမာဏ",
      dataIndex: "subtotal",
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
            ကုန်သည်အဝယ်စာရင်းသွင်းရန်
          </Title>
          <Row gutter={[16, 16]}>
            <Col
              xl={{
                span: 12,
              }}
            >
              <Space
                direction="horizontal"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
                size="large"
              >
                <Text type="secondary">ကုန်သည်အမည်ရွေးပါ</Text>
                <Select
                  showSearch
                  placeholder="ကျေးဇူးပြု၍ ကုန်သည်အမည်ရွေးပါ"
                  optionFilterProp="children"
                  onChange={onChange}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  allowClear={true}
                  size="large"
                  style={{ borderRadius: "10px" }}
                >
                  {merchant.merchants.map((mer) => (
                    <Option key={mer.id} value={mer.id}>
                      {`${mer.name}(${mer.company_name})`}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
          </Row>
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
              name="item_id"
              label="ပစ္စည်းအမည်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ပစ္စည်းအမည်ထည့်ပါ",
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
                {item.items.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {`${item.item_name.name}(${item.size})(${item.color})`}
                  </Option>
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
            <Form.Item
              name="price"
              label="တစ်ခုဈေးနှုန်း"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ တစ်ခုဈေးနှုန်းထည့်ပါ",
                },
              ]}
            >
              <InputNumber
                placeholder="တစ်ခုဈေးနှုန်းထည့်ပါ"
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
            dataSource={buys}
            pagination={{ position: ["none", "none"] }}
          />
          <Row gutter={[16, 16]}>
            <Col span={17} style={{ textAlign: "right" }}>
              <Title level={5}>စုစုပေါင်း</Title>
            </Col>
            <Col span={2}></Col>
            <Col span={5}>
              <Title level={5}>{buyTotal} Ks</Title>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={17} style={{ textAlign: "right" }}>
              <Title level={5}>ပေးငွေ</Title>
            </Col>
            <Col span={2}></Col>
            <Col span={5}>
              <InputNumber
                placeholder="ပေးငွေ"
                prefix={<EditOutlined />}
                style={{ borderRadius: "10px", width: "100%" }}
                size="middle"
                onChange={(value) => handlePayment(value)}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={17} style={{ textAlign: "right" }}>
              <Title level={5}>ပေးရန်ကျန်ငွေ</Title>
            </Col>
            <Col span={2}></Col>
            <Col span={5}>
              <Title level={5}>{credit} Ks</Title>
            </Col>
          </Row>
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
  item: store.item,
  merchant: store.merchant,
});

export default connect(mapStateToProps, {
  getMerchants,
  getItems,
  createPurchase,
})(CreateBuyMerchants);
