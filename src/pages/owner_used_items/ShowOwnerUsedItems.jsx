import React, { useEffect } from "react";
import {
  Typography,
  Space,
  Row,
  Col,
  Button,
  Table,
  Popconfirm,
  message,
  Spin,
} from "antd";
import Layout from "antd/lib/layout/layout";
import { PlusSquareOutlined, ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { getOwnerUsedItems, deleteOwnerUsedItem } from "../../store/actions";
import { getReadableDateDisplay } from "../../util/convertToHumanReadableTime";
import { successDeleteMessage } from "../../util/messages";
import { Positions } from "../../util/positions";

const { Title } = Typography;

const ShowOwnerUsedItems = ({
  status,
  error,
  auth,
  ownerUsedItem,
  getOwnerUsedItems,
  deleteOwnerUsedItem,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    getOwnerUsedItems();

    return () => getOwnerUsedItems();
  }, [getOwnerUsedItems]);

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
    await deleteOwnerUsedItem(id);
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
        title: "ပစ္စည်းအမည်",
        dataIndex: "stock",
        render: (stock) =>
          `${stock.item?.item_name?.name}(${stock.item?.size})(${stock.item?.color})`,
      },
      {
        title: "ပစ္စည်းကုတ်",
        dataIndex: "stock",
        render: (stock) => stock?.item?.code,
      },
      {
        title: "အရေအတွက်",
        dataIndex: "quantity",
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
  } else {
    columns = [
      {
        title: "ရက်စွဲ",
        dataIndex: "created_at",
        render: (createdAt) => getReadableDateDisplay(createdAt),
      },
      {
        title: "ပစ္စည်းအမည်",
        dataIndex: "stock",
        render: (stock) =>
          `${stock.item?.item_name?.name}(${stock.item?.size})(${stock.item?.color})`,
      },
      {
        title: "ပစ္စည်းကုတ်",
        dataIndex: "stock",
        render: (stock) => stock?.item?.code,
      },
      {
        title: "အရေအတွက်",
        dataIndex: "quantity",
      },
    ];
  }

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 18 }}>
              <Title level={3}>လုပ်ငန်းရှင်မှပစ္စည်းထုတ်သုံးခြင်း စာရင်း</Title>
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
                  onClick={() => navigate("/admin/create-owner-used-items")}
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
            dataSource={ownerUsedItem.ownerUsedItems}
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
  ownerUsedItem: store.ownerUsedItem,
});

export default connect(mapStateToProps, {
  getOwnerUsedItems,
  deleteOwnerUsedItem,
})(ShowOwnerUsedItems);
