import React, { useEffect } from "react";
import {
  Typography,
  Space,
  Row,
  Col,
  Button,
  Table,
  Spin,
  message,
  Popconfirm,
} from "antd";
import Layout from "antd/lib/layout/layout";
import { PlusSquareOutlined, ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { getUsers, deleteUser } from "../../store/actions";
import { successDeleteMessage } from "../../util/messages";

const { Title } = Typography;

const ShowAccounts = ({ error, status, auth, getUsers, deleteUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();

    return () => getUsers();
  }, [getUsers]);

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
    await deleteUser(id);
  };

  const columns = [
    {
      title: "အမည်",
      dataIndex: "name",
    },
    {
      title: "ရာထူး",
      dataIndex: "position",
    },
    {
      title: "ဆိုင်အမည်",
      dataIndex: "shop",
      render: (shop) => shop?.name,
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id) => (
        <Space direction="horizontal">
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

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 18 }}>
              <Title level={3}>အကောင့်စာရင်း</Title>
            </Col>
            <Col xl={{ span: 3 }}>
              <Button
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--white-color)",
                  borderRadius: "5px",
                }}
                size="middle"
                onClick={() => navigate("/admin/create-accounts")}
              >
                <PlusSquareOutlined />
                New
              </Button>
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
            dataSource={auth.users}
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
});

export default connect(mapStateToProps, { getUsers, deleteUser })(ShowAccounts);
