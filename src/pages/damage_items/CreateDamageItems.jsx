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
  message,
  Checkbox,
  Spin,
} from "antd";
import Layout from "antd/lib/layout/layout";
import {
  EditOutlined,
  SaveOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { getStocks, createDamageItem } from "../../store/actions";
import { successCreateMessage } from "../../util/messages";

const { Title } = Typography;
const { Option } = Select;
const CreateDamageItems = ({
  status,
  error,
  stock,
  getStocks,
  createDamageItem,
}) => {
  const [damageItems, setDamageItems] = useState([]);
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
      setDamageItems([]);
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
      setDamageItems([
        ...damageItems,
        {
          ...values,
          stock: findStock,
          key: damageItems.length + 1,
        },
      ]);
      form.resetFields();
    }
  };

  const handleDelete = (record) => {
    const filterDamageItems = damageItems.filter(
      (damageItem) => damageItem !== record
    );
    setDamageItems(filterDamageItems);
  };

  const handleSave = async () => {
    if (damageItems.length === 0) {
      message.error("ကျေးဇူးပြု၍ ပစ္စည်းထည့်ပါ");
    } else {
      const now = new Date();
      const date = dateFormat(now, "yyyy-mm-dd");

      const savedDamageItems = damageItems.map((damageItem) => {
        return {
          date: date,
          stock_id: damageItem.stock_id,
          quantity: damageItem.quantity,
          is_sale: damageItem.is_sale === undefined ? false : true,
        };
      });
      await createDamageItem({ damage_items: savedDamageItems });
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
            ချို့ယွင်းချက်ရှိပစ္စည်းများ
          </Title>
          <Space
            direction="horizontal"
            style={{
              width: "100%",
              justifyContent: "center",
              marginBottom: "10px",
            }}
            size="large"
          ></Space>

          <Form
            labelCol={{
              xl: {
                span: 3,
              },
            }}
            wrapperCol={{
              span: 24,
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
                  message: "ကျေးဇူးပြု၍ ပစ္စည်းကုတ်/အမည်ထည့်ပါ",
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
            <Form.Item
              name="is_sale"
              valuePropName="checked"
              wrapperCol={{ offset: 3, span: 16 }}
            >
              <Checkbox>ရောင်းပြီးသားပစ္စည်းလာလဲခြင်းလား</Checkbox>
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
            dataSource={damageItems}
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
  stock: store.stock,
});

export default connect(mapStateToProps, {
  getStocks,
  createDamageItem,
})(CreateDamageItems);
