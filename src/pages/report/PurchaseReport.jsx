import React, { useEffect } from "react";
import { Typography, Space, Table, DatePicker, message, Spin } from "antd";
import Layout from "antd/lib/layout/layout";
import queryString from "query-string";
import dayjs from "dayjs";
import { connect } from "react-redux";
import { getPurchaseReport } from "../../store/actions";
import { useLocation } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const PurchaseReport = ({ status, error, purchase, getPurchaseReport }) => {
  const location = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      await getPurchaseReport(queryString.parse(location.search));
    };
    fetchData();
    return () => fetchData();
  }, [getPurchaseReport, location.search]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  const columns = [
    {
      title: "ကုန်သည်အမည်",
      dataIndex: "merchant",
      render: (merchant) => merchant.name,
    },
    {
      title: "စုစုပေါင်း",
      dataIndex: "whole_total",
      sorter: (a, b) => a.whole_total - b.whole_total,
    },
    {
      title: "ပေးပြီးငွေစုစုပေါင်း",
      dataIndex: "paid",
      sorter: (a, b) => a.paid - b.paid,
    },
    {
      title: "ပေးရန်ကျန်ငွေစုစုပေါင်း",
      dataIndex: "credit",
      sorter: (a, b) => a.credit - b.credit,
    },
  ];

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title level={3}>အဝယ်မှတ်တမ်းစာမျက်နှာ</Title>
          <RangePicker
            onChange={(val) => {
              window.location = `/admin/purchase-report?start_date=${dayjs(
                val[0]
              ).format("YYYY-MM-DD")}&end_date=${dayjs(val[1]).format(
                "YYYY-MM-DD"
              )}`;
            }}
          />
          <Table
            bordered
            columns={columns}
            pagination={{ defaultPageSize: 10 }}
            dataSource={purchase.purchaseReport}
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
  getPurchaseReport,
})(PurchaseReport);
