import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Typography,
  Space,
  Button,
  Table,
  InputNumber,
  message,
  Select,
  Spin,
} from "antd";
import Layout from "antd/lib/layout/layout";
import {
  EditOutlined,
  SaveOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import InputUpload from "../../components/InputUpload";
import { connect } from "react-redux";
import { getItemNames, createItem } from "../../store/actions";
import { successCreateMessage } from "../../util/messages";

const { Title, Text } = Typography;
const { Option } = Select;

const CreateItems = ({ status, error, itemName, getItemNames, createItem }) => {
  const [items, setItems] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    getItemNames();

    return () => getItemNames();
  }, [getItemNames]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  useEffect(() => {
    if (status.success) {
      setItems([]);
      message.success(successCreateMessage);
    }

    return () => status.success;
  }, [form, status.success]);

  const onFinish = (values) => {
    if (fileList.length === 0) {
      message.error("ကျေးဇူးပြု၍ပစ္စည်းပုံထည့်ပါ");
    }

    if (fileList.length > 0) {
      const item_name = itemName.itemNames.find(
        (itemName) => itemName.id === values.item_name_id
      );
      setItems([
        ...items,
        { ...values, item_name, image: fileList[0], key: items.length + 1 },
      ]);
      setFileList([]);
      form.resetFields();
    }
  };

  const handleDelete = (record) => {
    const filterItems = items.filter((item) => item !== record);
    const transformItems = filterItems.map((item, index) => {
      return {
        ...item,
        key: index + 1,
      };
    });
    setItems(transformItems);
  };

  const handleSave = async () => {
    if (items.length === 0) {
      message.error("ကျေးဇူးပြု၍ပစ္စည်းများထည့်ပါ");
    } else {
      const formData = new FormData();
      items.forEach((item, index) => {
        formData.append(`items[${index}][code]`, item.code);
        formData.append(`items[${index}][item_name_id]`, item.item_name_id);
        formData.append(`items[${index}][size]`, item.size);
        formData.append(`items[${index}][color]`, item.color);
        formData.append(`items[${index}][buy_price]`, item.buy_price);
        formData.append(`items[${index}][sale_price]`, item.sale_price);
        formData.append(`images[${index}]`, item.image.originFileObj);
      });

      await createItem(formData);
    }
  };

  const columns = [
    {
      title: "ပစ္စည်းပုံ",
      dataIndex: "image_url",
      render: (_, record) => (
        <img
          src={record.image.thumbUrl}
          alt="ပစ္စည်းပုံ"
          width={100}
          height={100}
        />
      ),
    },
    {
      title: "ပစ္စည်းကုတ်",
      dataIndex: "code",
    },
    {
      title: "ပစ္စည်းအမည်",
      dataIndex: "item_name",
      render: (itemName) => itemName.name,
    },
    {
      title: "ပစ္စည်းဆိုဒ်",
      dataIndex: "size",
    },
    {
      title: "ကာလာ",
      dataIndex: "color",
    },
    {
      title: "ဝယ်ဈေး",
      dataIndex: "buy_price",
    },
    {
      title: "ရောင်းဈေး",
      dataIndex: "sale_price",
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
            ပစ္စည်းအချက်အလက်သွင်းရန်စာမျက်နှာ
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
            <Space
              direction="vertical"
              style={{
                width: "100%",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <InputUpload fileList={fileList} setFileList={setFileList} />
              <Text type="secondary">ကျေးဇူးပြု၍ပစ္စည်းပုံထည့်ပါ</Text>
            </Space>
            <Form.Item
              name="code"
              label="ပစ္စည်းကုတ်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ပစ္စည်းကုတ်ထည့်ပါ",
                },
              ]}
            >
              <Input
                placeholder="ပစ္စည်းကုတ်ထည့်ပါ"
                prefix={<EditOutlined />}
                style={{ borderRadius: "10px" }}
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="item_name_id"
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
                {itemName.itemNames.map((itemName) => (
                  <Option value={itemName.id} key={itemName.id}>
                    {itemName.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="size"
              label="ပစ္စည်းဆိုဒ်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ပစ္စည်းဆိုဒ်ထည့်ပါ",
                },
              ]}
            >
              <Input
                placeholder="ပစ္စည်းဆိုဒ်ထည့်ပါ"
                prefix={<EditOutlined />}
                style={{ borderRadius: "10px" }}
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="color"
              label="ကာလာ"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ကာလာထည့်ပါ",
                },
              ]}
            >
              <Input
                placeholder="ကာလာထည့်ပါ"
                prefix={<EditOutlined />}
                style={{ borderRadius: "10px" }}
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="buy_price"
              label="ဝယ်ဈေး"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ဝယ်ဈေးထည့်ပါ",
                },
              ]}
            >
              <InputNumber
                placeholder="ဝယ်ဈေးထည့်ပါ"
                prefix={<EditOutlined />}
                style={{ borderRadius: "10px", width: "100%" }}
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="sale_price"
              label="ရောင်းဈေး"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ရောင်းဈေးထည့်ပါ",
                },
              ]}
            >
              <InputNumber
                placeholder="ရောင်းဈေးထည့်ပါ"
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
            dataSource={items}
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
  itemName: store.itemName,
});

export default connect(mapStateToProps, { getItemNames, createItem })(CreateItems);
