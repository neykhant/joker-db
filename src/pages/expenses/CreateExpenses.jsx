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
  Drawer,
  Select,
  Row,
  Col,
  Spin,
} from "antd";
import Layout from "antd/lib/layout/layout";
import {
  EditOutlined,
  SaveOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { getExpenseNames, createExpense } from "../../store/actions";
import { successCreateMessage } from "../../util/messages";

const { Title } = Typography;
const { Option } = Select;

const CreateExpenses = ({
  status,
  error,
  expenseName,
  getExpenseNames,
  createExpense,
}) => {
  const [expenses, setExpenses] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [expenseFrom] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    getExpenseNames();

    return () => getExpenseNames();
  }, [getExpenseNames]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  useEffect(() => {
    if (status.success) {
      setExpenses([]);
      message.success(successCreateMessage);
    }

    return () => status.success;
  }, [form, status.success]);

  const onFinish = (values) => {
    setExpenses([...expenses, { ...values, key: expenses.length + 1 }]);
    form.resetFields();
  };

  const handleDelete = (record) => {
    const filterExpenses = expenses.filter((expense) => expense !== record);
    setExpenses(filterExpenses);
  };

  const handleSave = async () => {
    if (expenses.length === 0) {
      message.error("ကျေးဇူးပြု၍ကုန်ကျစရိတ်များထည့်ပါ");
    } else {
      const saveExpenses = expenses.map((expense) => {
        return {
          name: expense.name,
          amount: expense.amount,
        };
      });
      await createExpense({ expenses: saveExpenses });
    }
  };

  const handleSaveExpense = (values) => {
    console.log(values);
  };

  const columns = [
    {
      title: "ကုန်ကျစရိတ်အမည်",
      dataIndex: "name",
    },
    {
      title: "ပမာဏ",
      dataIndex: "amount",
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
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 18 }}>
              <Title style={{ textAlign: "center" }} level={3}>
                ကုန်ကျစရိတ်သွင်းရန်စာမျက်နှာ
              </Title>
            </Col>
            <Col xl={{ span: 1 }}></Col>
            <Col xl={{ span: 5 }}>
              <Button
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--white-color)",
                  borderRadius: "5px",
                }}
                size="middle"
                onClick={() => navigate("/admin/create-expense-names")}
              >
                <PlusSquareOutlined />
                ကုန်ကျစရိတ်အမည်ထည့်ရန်
              </Button>
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
                <PlusSquareOutlined />
                အသစ်ထည့်မည်
              </Button>
            </Form.Item>
          </Form>
          <Table
            bordered
            columns={columns}
            dataSource={expenses}
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
      <Drawer
        title="ကုန်ကျစရိတ်ထည့်ရန်"
        placement="right"
        visible={visible}
        onClose={() => {
          setVisible(false);
          expenseFrom.resetFields();
        }}
        maskClosable={false}
        width={380}
      >
        <Form
          initialValues={{
            remember: true,
          }}
          onFinish={handleSaveExpense}
          form={expenseFrom}
        >
          <Form.Item
            name="expense_name"
            rules={[
              {
                required: true,
                message: "ကျေးဇူးပြု၍ ကုန်ကျစရိတ်အမည်ထည့်ပါ",
              },
            ]}
          >
            <Input
              placeholder="ကုန်ကျစရိတ်အမည်ထည့်ပါ"
              prefix={<EditOutlined />}
              style={{ borderRadius: "10px" }}
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              style={{
                backgroundColor: "var(--primary-color)",
                color: "var(--white-color)",
                borderRadius: "10px",
                width: "100%",
              }}
              size="large"
              htmlType="submit"
            >
              <PlusSquareOutlined />
              အသစ်ထည့်မည်
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </Spin>
  );
};

const mapStateToProps = (store) => ({
  status: store.status,
  error: store.error,
  expenseName: store.expenseName,
});

export default connect(mapStateToProps, { getExpenseNames, createExpense })(
  CreateExpenses
);
