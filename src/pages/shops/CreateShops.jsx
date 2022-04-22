import React, { useEffect } from "react";
import { Form, Input, Typography, Space, Button, message, Spin } from "antd";
import Layout from "antd/lib/layout/layout";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { createShop } from "../../store/actions";
import { successCreateMessage } from "../../util/messages";

const { Title } = Typography;

const CreateShops = ({ status, error, createShop }) => {
  const [form] = Form.useForm();

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
    await createShop(values);
  };

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title style={{ textAlign: "center" }} level={3}>
            ဆိုင်အမည် သွင်းခြင်း စာမျက်နှာ
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
              name="name"
              label="ဆိုင်အမည်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ဆိုင်အမည်ထည့်ပါ",
                },
              ]}
            >
              <Input
                placeholder="ဆိုင်အမည်ထည့်ပါ"
                prefix={<EditOutlined />}
                style={{ borderRadius: "10px" }}
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
});

export default connect(mapStateToProps, { createShop })(CreateShops);
