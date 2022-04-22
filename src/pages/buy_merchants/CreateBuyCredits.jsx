import React, { useEffect, useState } from "react";
import {
  Space,
  Typography,
  Form,
  Button,
  InputNumber,
  Table,
  message,
  Spin,
  Popconfirm,
} from "antd";
import Layout from "antd/lib/layout/layout";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import {
  getPurchase,
  createPurchaseCredit,
  deletePurchaseCredit,
} from "../../store/actions";
import {
  successCreateMessage,
  successDeleteMessage,
} from "../../util/messages";
import { useParams } from "react-router-dom";
import { getReadableDateDisplay } from "../../util/convertToHumanReadableTime";

const { Title } = Typography;

const CreateBuyCredits = ({
  status,
  error,
  purchase,
  getPurchase,
  createPurchaseCredit,
  deletePurchaseCredit,
}) => {
  const [credits, setCredits] = useState([]);
  const [form] = Form.useForm();
  const param = useParams();

  useEffect(() => {
    const fetchData = async () => {
      await getPurchase(param.id);
    };

    fetchData();
    return () => fetchData();
  }, [getPurchase, param.id]);

  useEffect(() => {
    const transfromCredits = purchase.purchase.purchase_credits?.map(
      (credit) => {
        return {
          ...credit,
          key: credit.id,
        };
      }
    );
    setCredits(transfromCredits);
  }, [purchase.purchase]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  useEffect(() => {
    if (status.success) {
      form.resetFields();
      getPurchase(param.id);
      message.success(successCreateMessage);
    }

    return () => status.success;
  }, [form, status.success, getPurchase, param.id]);

  useEffect(() => {
    if (status.delete) {
      getPurchase(param.id);
      message.success(successDeleteMessage);
    }

    return () => status.delete;
  }, [status.delete, getPurchase, param.id]);

  const onFinish = async (values) => {
    await createPurchaseCredit({ ...values, purchase_id: param.id });
  };

  const handleDelete = async (id) => {
    await deletePurchaseCredit(id);
  };

  const columns = [
    {
      title: "ပမာဏ",
      dataIndex: "amount",
    },
    {
      title: "ရက်စွဲ",
      dataIndex: "created_at",
      render: (createdAt) => getReadableDateDisplay(createdAt),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id) => (
        <Popconfirm
          title="ဖျက်မှာ သေချာပြီလား"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(id)}
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title style={{ textAlign: "center" }} level={3}>
            ကုန်သည်အဝယ်အကြွေးဆပ်ရန်
          </Title>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
            size="large"
          >
            <Title level={4}>ပေးရန်ကျန်ငွေစုစုပေါင်း - </Title>
            <Title level={4}>{purchase.purchase.credit} Ks</Title>
          </Space>
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
          <Table
            bordered
            columns={columns}
            dataSource={credits}
            pagination={{ position: ["none", "none"] }}
          />
        </Space>
      </Layout>
    </Spin>
  );
};

const mapStateToProps = (store) => ({
  status: store.status,
  error: store.error,
  purchase: store.purchase,
});

export default connect(mapStateToProps, {
  getPurchase,
  createPurchaseCredit,
  deletePurchaseCredit,
})(CreateBuyCredits);
