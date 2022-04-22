import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Typography,
  Space,
  Button,
  InputNumber,
  message,
  Select,
  Spin,
} from "antd";
import Layout from "antd/lib/layout/layout";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import InputUpload from "../../components/InputUpload";
import { connect } from "react-redux";
import { getItemNames, getItem, editItem } from "../../store/actions";
import { successEditMessage } from "../../util/messages";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const EditItems = ({
  status,
  error,
  itemName,
  item,
  getItemNames,
  getItem,
  editItem
}) => {
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const param = useParams();

  useEffect(() => {
    getItemNames();

    return () => getItemNames();
  }, [getItemNames]);

  useEffect(() => {
    getItem(param.id);
  }, [getItem, param.id]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  useEffect(() => {
    if (status.success) {
      message.success(successEditMessage);
    }

    return () => status.success;
  }, [form, status.success]);

  useEffect(() => {
    form.setFieldsValue({ code: item.item.code });
    form.setFieldsValue({ item_name_id: item.item.item_name?.id });
    form.setFieldsValue({ size: item.item.size });
    form.setFieldsValue({ color: item.item.color });
    form.setFieldsValue({ buy_price: item.item.buy_price });
    form.setFieldsValue({ sale_price: item.item.sale_price });
    setFileList([
      {
        uid: item.item.id,
        name: item.item.item_name?.name,
        status: "done",
        url: item.item.image,
      },
    ]);
  }, [form, item.item]);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("code", values.code);
    formData.append("item_name_id", values.item_name_id);
    formData.append("size", values.size);
    formData.append("color", values.color);
    formData.append("buy_price", values.buy_price);
    formData.append("sale_price", values.sale_price);
    if (fileList[0].status !== "done") {
      formData.append("image", fileList[0].originFileObj);
    }
    await editItem(param?.id, formData);
  };

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title style={{ textAlign: "center" }} level={3}>
            ပစ္စည်းအချက်အလက်ပြင်ဆင်ရန်စာမျက်နှာ
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
  itemName: store.itemName,
  item: store.item,
});

export default connect(mapStateToProps, { getItemNames, getItem, editItem })(EditItems);
