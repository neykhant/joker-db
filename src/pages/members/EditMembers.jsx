import React, { useEffect } from "react";
import { Form, Input, Typography, Space, Button, message, Spin } from "antd";
import Layout from "antd/lib/layout/layout";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { getMember, editMember } from "../../store/actions";
import { successEditMessage } from "../../util/messages";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const EditMembers = ({ status, error, member, getMember, editMember }) => {
  const param = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    getMember(param.id);
  }, [getMember, param.id]);

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
    form.setFieldsValue({ code: member.member.code });
    form.setFieldsValue({ name: member.member.name });
    form.setFieldsValue({ phone: member.member.phone });
    form.setFieldsValue({ address: member.member.address });
  }, [form, member.member]);

  const onFinish = async (values) => {
    await editMember(param.id, values);
  };

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title style={{ textAlign: "center" }} level={3}>
            Member စာရင်းပြင်ဆင်ခြင်း စာမျက်နှာ
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
              label="မန်ဘာကုတ်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ မန်ဘာကုတ်ထည့်ပါ",
                },
              ]}
            >
              <Input
                placeholder="မန်ဘာကုတ်ထည့်ပါ"
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
              name="phone"
              label="ဖုန်းနံပါတ်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ဖုန်းနံပါတ်ထည့်ပါ",
                },
              ]}
            >
              <Input
                placeholder="ဖုန်းနံပါတ်ထည့်ပါ"
                prefix={<EditOutlined />}
                style={{ borderRadius: "10px" }}
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="address"
              label="နေရပ်လိပ်စာ"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ နေရပ်လိပ်စာထည့်ပါ",
                },
              ]}
            >
              <Input
                placeholder="နေရပ်လိပ်စာထည့်ပါ"
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
  member: store.member,
});

export default connect(mapStateToProps, { getMember, editMember })(EditMembers);
