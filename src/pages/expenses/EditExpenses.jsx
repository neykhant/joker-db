import React, { useEffect } from "react";
import {
  Form,
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
import { connect } from "react-redux";
import { getExpenseNames, getExpense, editExpense } from "../../store/actions";
import { successEditMessage } from "../../util/messages";
import { useParams } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const EditExpenses = ({
  status,
  error,
  expenseName,
  getExpenseNames,
  expense,
  getExpense,
  editExpense,
}) => {
  const param = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    getExpenseNames();

    return () => getExpenseNames();
  }, [getExpenseNames]);

  useEffect(() => {
    getExpense(param.id);
  }, [getExpense, param.id]);

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
    form.setFieldsValue({ name: expense.expense.name });
    form.setFieldsValue({ amount: expense.expense.amount });
  }, [form, expense.expense]);

  const onFinish = async (values) => {
    await editExpense(param.id, values);
  };

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title style={{ textAlign: "center" }} level={3}>
            ကုန်ကျစရိတ်ပြင်ရန်စာမျက်နှာ
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
              label="ကုန်ကျစရိတ်အမည်"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ကုန်ကျစရိတ်အမည်ရွေးပါ",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="ကျေးဇူးပြု၍ ကုန်သည်အမည်ရွေးပါ"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                allowClear={true}
                size="large"
                style={{ borderRadius: "10px" }}
              >
                {expenseName.expenseNames.map((expenseName) => (
                  <Option value={expenseName.name} key={expenseName.id}>
                    {expenseName.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="amount"
              label="ပမာဏ"
              rules={[
                {
                  required: true,
                  message: "ကျေးဇူးပြု၍ ပမာဏထည့်ပါ",
                },
              ]}
            >
              <InputNumber
                placeholder="ပမာဏထည့်ပါ"
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
  expenseName: store.expenseName,
  expense: store.expense,
});

export default connect(mapStateToProps, {
  getExpenseNames,
  getExpense,
  editExpense,
})(EditExpenses);
