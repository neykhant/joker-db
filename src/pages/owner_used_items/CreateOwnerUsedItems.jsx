import React, { useEffect } from "react";
import dateFormat from "dateformat";
import {
  Form,
  Typography,
  Space,
  Button,
  Select,
  message,
  Spin,
  InputNumber,
} from "antd";
import Layout from "antd/lib/layout/layout";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { getStocks, createOwnerUsedItem } from "../../store/actions";
import { successCreateMessage } from "../../util/messages";

const { Title } = Typography;
const { Option } = Select;

const CreateOwnerUsedItems = ({
  status,
  error,
  stock,
  getStocks,
  createOwnerUsedItem,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      await getStocks();
    };

    fetchData();
    return () => fetchData();
  }, [getStocks]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  useEffect(() => {
    if (status.success) {
      form.resetFields();
      message.success(successCreateMessage);
    }

    return () => status.success;
  }, [form, status.success]);

  const onFinish = async (values) => {
    const findStock = stock.stocks.find(
      (stock) => stock.id === values.stock_id
    );
    if (values.quantity === 0 || findStock.quantity < values.quantity) {
      message.error("လက်ကျန်ပမာဏထက်များနေပါသည်။");
    } else {
      const now = new Date();
      const date = dateFormat(now, "yyyy-mm-dd");
      await createOwnerUsedItem({ ...values, date });
    }
  };

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title style={{ textAlign: "center" }} level={3}>
            လုပ်ငန်းရှင်မှပစ္စည်းထုတ်သုံးခြင်း စာမျက်နှာ
          </Title>
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
              label="ပစ္စည်းကုတ်/အမည်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ပစ္စည်းကုတ်/အမည်ရွေးပါ",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="ကျေးဇူးပြု၍ ပစ္စည်းကုတ်/အမည်ရွေးပါ"
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
                  backgroundColor: "var(--primary-color)",
                  color: "var(--white-color)",
                  borderRadius: "10px",
                }}
                size="large"
                htmlType="submit"
              >
                <SaveOutlined />
                သိမ်းမည်
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Layout>
    </Spin>
  );
};

const mapStateToProps = (store) => ({
  status: store.status,
  error: store.error,
  stock: store.stock,
});

export default connect(mapStateToProps, { getStocks, createOwnerUsedItem })(
  CreateOwnerUsedItems
);
