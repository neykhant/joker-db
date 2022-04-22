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
import { getItemNames, deleteItemName } from "../../store/actions";
import { successDeleteMessage } from "../../util/messages";

const { Title } = Typography;

const ShowItemNames = ({
  status,
  error,
  itemName,
  getItemNames,
  deleteItemName,
}) => {
  const navigate = useNavigate();

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
      message.success(successDeleteMessage);
    }

    return () => status.success;
  }, [status.success]);

  const handleDelete = async (id) => {
    await deleteItemName(id);
  };

  const columns = [
    {
      title: "ပစ္စည်းအမည်",
      dataIndex: "name",
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id) => (
        <Space direction="horizontal">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/edit-item-names/${id}`)}
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

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 18 }}>
              <Title level={3}>ပစ္စည်းအမည်စာရင်း</Title>
            </Col>
            <Col xl={{ span: 3 }}>
              <Button
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--white-color)",
                  borderRadius: "5px",
                }}
                size="middle"
                onClick={() => navigate("/admin/create-item-names")}
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
            dataSource={itemName.itemNames}
          />
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

export default connect(mapStateToProps, { getItemNames, deleteItemName })(
  ShowItemNames
);
