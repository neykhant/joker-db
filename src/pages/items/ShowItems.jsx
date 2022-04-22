import React, { useEffect } from "react";
import {
  Typography,
  Space,
  Row,
  Col,
  Button,
  Table,
  message,
  Spin,
  Popconfirm,
} from "antd";
import Layout from "antd/lib/layout/layout";
import { PlusSquareOutlined, ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { getItems, deleteItem } from "../../store/actions";
import { successDeleteMessage } from "../../util/messages";

const { Title } = Typography;

const ShowItems = ({ status, error, item, getItems, deleteItem }) => {
  const navigate = useNavigate();

  useEffect(() => {
    getItems();

    return () => getItems();
  }, [getItems]);

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
    await deleteItem(id);
  };

  const columns = [
    {
      title: "ပစ္စည်းပုံ",
      dataIndex: "image",
      render: (image) => (
        <img src={image} alt="ပစ္စည်းပုံ" width={100} height={100} />
      ),
    },
    {
      title: "ပစ္စည်းကုတ်",
      dataIndex: "code",
    },
    {
      title: "ပစ္စည်းအမည်",
      dataIndex: "item_name",
      render: (item_name) => item_name.name,
    },
    {
      title: "ပစ္စည်းဆိုဒ်",
      dataIndex: "size",
    },
    {
      title: "ကာလာ",
      dataIndex: "color",
    },
    {
      title: "ဝယ်ဈေး",
      dataIndex: "buy_price",
    },
    {
      title: "ရောင်းဈေး",
      dataIndex: "sale_price",
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id) => (
        <Space direction="horizontal">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/edit-items/${id}`)}
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
              <Title level={3}>ပစ္စည်းစာရင်း</Title>
            </Col>
            <Col xl={{ span: 3 }}>
              <Button
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--white-color)",
                  borderRadius: "5px",
                }}
                size="middle"
                onClick={() => navigate("/admin/create-items")}
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
            dataSource={item.items}
          />
        </Space>
      </Layout>
    </Spin>
  );
};

const mapStateToProps = (store) => ({
  status: store.status,
  error: store.error,
  item: store.item,
});

export default connect(mapStateToProps, { getItems, deleteItem })(ShowItems);
