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
import { getDamageItems, deleteDamageItem } from "../../store/actions";
import { getReadableDateDisplay } from "../../util/convertToHumanReadableTime";
import { successDeleteMessage } from "../../util/messages";
import { Positions } from "../../util/positions";

const { Title } = Typography;

const ShowDamageItems = ({
  status,
  error,
  auth,
  damageItem,
  getDamageItems,
  deleteDamageItem,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    getDamageItems();

    return () => getDamageItems();
  }, [getDamageItems]);

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
    await deleteDamageItem(id);
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
              <Title level={3}>ချို့ယွင်းချက်ရှိပစ္စည်းများ စာရင်း</Title>
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
                  onClick={() => navigate("/admin/create-damage-items")}
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
            dataSource={damageItem.damageItems}
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
  damageItem: store.damageItem,
});

export default connect(mapStateToProps, {
  getDamageItems,
  deleteDamageItem,
})(ShowDamageItems);
