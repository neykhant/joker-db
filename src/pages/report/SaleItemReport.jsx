import React, { useEffect } from "react";
import {
  Typography,
  Space,
  Table,
  DatePicker,
  message,
  Spin,
  Button,
  Col,
  Row,
} from "antd";
import Layout from "antd/lib/layout/layout";
import queryString from "query-string";
import dayjs from "dayjs";
import { connect } from "react-redux";
import { getInvoiceItems } from "../../store/actions";
import { getReadableDateDisplay } from "../../util/convertToHumanReadableTime";
import { useLocation, useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const SaleItemReport = ({ status, error, item, getInvoiceItems }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getInvoiceItems(queryString.parse(location.search));

    return () => getInvoiceItems();
  }, [getInvoiceItems, location.search]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  const columns = [
    {
      title: "စဥ်",
      dataIndex: "id",
    },
    {
      title: "ရက်စွဲ",
      dataIndex: "created_at",
      render: (createdAt) => getReadableDateDisplay(createdAt),
    },
    {
      title: "ပစ္စည်းအမည်",
      dataIndex: "stock",
      render: (stock) =>
        `${stock?.item?.item_name?.name}(${stock?.item.size})(${stock?.item.color})`,
    },
    {
      title: "တစ်ခုဈေး",
      dataIndex: "price",
    },
    {
      title: "အရေအတွက်",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "စုစုပေါင်း",
      dataIndex: "subtotal",
    },
  ];

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title level={3}>ပစ္စည်းအရောင်းမှတ်တမ်းစာမျက်နှာ</Title>

          <Row gutter={[16, 16]}>
            <Col xl={{ span: 18 }}>
              <RangePicker
                onChange={(val) => {
                  window.location = `/admin/sale-item-report?start_date=${dayjs(
                    val[0]
                  ).format("YYYY-MM-DD")}&end_date=${dayjs(val[1]).format(
                    "YYYY-MM-DD"
                  )}`;
                }}
              />
            </Col>
            <Col xl={{ span: 6 }}>
              <Button
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--white-color)",
                  borderRadius: "5px",
                }}
                size="middle"
                onClick={() => navigate("/admin/best-item-report")}
              >
                ရောင်းအားကောင်းသောပစ္စည်းစာရင်း
              </Button>
            </Col>
          </Row>
          <Table
            bordered
            columns={columns}
            pagination={{ defaultPageSize: 10 }}
            dataSource={item.invoiceItems}
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

export default connect(mapStateToProps, {
  getInvoiceItems,
})(SaleItemReport);
