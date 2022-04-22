import React, { useEffect } from "react";
import { Form, Input, Typography, Space, Button, Spin, message } from "antd";
import Layout from "antd/lib/layout/layout";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { getMerchant, editMerchant } from "../../store/actions";
import { successEditMessage } from "../../util/messages";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const EditMerchants = ({
  status,
  error,
  merchant,
  getMerchant,
  editMerchant,
}) => {
  const param = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    getMerchant(param.id);
  }, [getMerchant, param.id]);

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
    form.setFieldsValue({ code: merchant.merchant.code });
    form.setFieldsValue({ name: merchant.merchant.name });
    form.setFieldsValue({ company_name: merchant.merchant.company_name });
    form.setFieldsValue({ other: merchant.merchant.other });
  }, [form, merchant.merchant]);

  const onFinish = async (values) => {
    await editMerchant(param.id, values);
  };

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title style={{ textAlign: "center" }} level={3}>
            ကုန်သည်အချက်အလက်ပြင်ဆင်ရန်စာမျက်နှာ
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
              name="code"
              label="ကုတ်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ကုတ်ထည့်ပါ",
                },
              ]}
            >
              <Input
                placeholder="ကုတ်ထည့်ပါ"
                prefix={<EditOutlined />}
                style={{ borderRadius: "10px" }}
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="name"
              label="အမည်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ အမည်ထည့်ပါ",
                },
              ]}
            >
              <Input
                placeholder="အမည်ထည့်ပါ"
                prefix={<EditOutlined />}
                style={{ borderRadius: "10px" }}
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="company_name"
              label="ကုမ္ပဏီအမည်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ကုမ္ပဏီအမည်ထည့်ပါ",
                },
              ]}
            >
              <Input
                placeholder="ကုမ္ပဏီအမည်ထည့်ပါ"
                prefix={<EditOutlined />}
                style={{ borderRadius: "10px" }}
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="other"
              label="အခြားအချက်လက်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ အခြားအချက်လက်ထည့်ပါ",
                },
              ]}
            >
              <Input
                placeholder="အခြားအချက်လက်ထည့်ပါ"
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
  merchant: store.merchant,
});

export default connect(mapStateToProps, { getMerchant, editMerchant })(
  EditMerchants
);
