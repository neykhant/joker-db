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
} from "antd";
import Layout from "antd/lib/layout/layout";
import { ExportOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { getStocks } from "../../store/actions";

const { Title } = Typography;

const ShowStocks = ({ status, error, stock, getStocks }) => {
  useEffect(() => {
    getStocks();

    return () => getStocks();
  }, [getStocks]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  const columns = [
    {
      title: "ပစ္စည်းပုံ",
      dataIndex: "item",
      render: (item) => (
        <img src={item.image} alt="ပစ္စည်းပုံ" width={100} height={100} />
      ),
    },
    {
      title: "ပစ္စည်းကုတ်",
      dataIndex: "item",
      render: (item) => item.code,
    },
    {
      title: "ပစ္စည်းအမည်",
      dataIndex: "item",
      render: (item) => item.item_name.name,
    },
    {
      title: "ပစ္စည်းဆိုဒ်",
      dataIndex: "item",
      render: (item) => item.size,
    },
    {
      title: "ကာလာ",
      dataIndex: "item",
      render: (item) => item.color,
    },
    {
      title: "Qty",
      dataIndex: "quantity",
    },
    {
      title: "ဝယ်ဈေး",
      dataIndex: "item",
      render: (item) => item.buy_price,
    },
    {
      title: "ရောင်းဈေး",
      dataIndex: "item",
      render: (item) => item.sale_price,
    },
  ];

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 18 }}>
              <Title level={3}>Stock စာရင်း</Title>
            </Col>
            <Col xl={{ span: 3 }}></Col>
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
            dataSource={stock.stocks}
          />
        </Space>
      </Layout>
    </Spin>
  );
};

const mapStateToProps = (store) => ({
  status: store.status,
  error: store.error,
  stock: store.stock,
});

export default connect(mapStateToProps, { getStocks })(ShowStocks);
