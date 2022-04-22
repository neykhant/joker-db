import React, { useEffect } from "react";
import {
  Typography,
  Space,
  Row,
  Col,
  Button,
  Table,
  message,
  Popconfirm,
  Spin,
} from "antd";
import Layout from "antd/lib/layout/layout";
import { PlusSquareOutlined, ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { getExpenses, deleteExpense } from "../../store/actions";
import { successDeleteMessage } from "../../util/messages";
import { getReadableDateDisplay } from "../../util/convertToHumanReadableTime";
import { Positions } from "../../util/positions";

const { Title } = Typography;

const ShowExpenses = ({
  status,
  error,
  auth,
  expense,
  getExpenses,
  deleteExpense,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    getExpenses();

    return () => getExpenses();
  }, [getExpenses]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  useEffect(() => {
    if (status.success) {
      message.success(successDeleteMessage);
    }

    return () => status.success;
  }, [status.success]);

  const handleDelete = async (id) => {
    await deleteExpense(id);
  };

  const { position } = auth.user;
  let columns = [];

  if (position === Positions.MANAGER || position === Positions.STAFF) {
    columns = [
      {
        title: "ရက်စွဲ",
        dataIndex: "created_at",
        render: (createdAt) => getReadableDateDisplay(createdAt),
      },
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
        dataIndex: "id",
        render: (id) => (
          <Space direction="horizontal">
            <Button
              type="primary"
              onClick={() => navigate(`/admin/edit-expenses/${id}`)}
            >
              Edit
            </Button>
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
          </Space>
        ),
      },
    ];
  } else {
    columns = [
      {
        title: "ရက်စွဲ",
        dataIndex: "created_at",
        render: (createdAt) => getReadableDateDisplay(createdAt),
      },
      {
        title: "ကုန်ကျစရိတ်အမည်",
        dataIndex: "name",
      },
      {
        title: "ပမာဏ",
        dataIndex: "amount",
      },
    ];
  }

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 18 }}>
              <Title level={3}>ကုန်ကျစရိတ်စာရင်း</Title>
            </Col>
            <Col xl={{ span: 3 }}>
              {(position === Positions.MANAGER ||
                position === Positions.STAFF) && (
                <Button
                  style={{
                    backgroundColor: "var(--primary-color)",
                    color: "var(--white-color)",
                    borderRadius: "5px",
                  }}
                  size="middle"
                  onClick={() => navigate("/admin/create-expenses")}
                >
                  <PlusSquareOutlined />
                  New
                </Button>
              )}
            </Col>
            <Col xl={{ span: 3 }}>
              <Button
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--white-color)",
                  borderRadius: "5px",
                }}
                size="middle"
              >
                <ExportOutlined />
                Export
              </Button>
            </Col>
          </Row>
          <Table
            bordered
            columns={columns}
            pagination={{ defaultPageSize: 10 }}
            dataSource={expense.expenses}
          />
        </Space>
      </Layout>
    </Spin>
  );
};

const mapStateToProps = (store) => ({
  status: store.status,
  error: store.error,
  auth: store.auth,
  expense: store.expense,
});

export default connect(mapStateToProps, { getExpenses, deleteExpense })(
  ShowExpenses
);
