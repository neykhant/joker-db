import React, { useEffect } from "react";
import { Typography, Space, Table, DatePicker, message, Spin } from "antd";
import Layout from "antd/lib/layout/layout";
import queryString from "query-string";
import dayjs from "dayjs";
import { connect } from "react-redux";
import { getInvoiceReport } from "../../store/actions";
import { useLocation } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const ProfitReport = ({ status, error, sale, getInvoiceReport }) => {
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      await getInvoiceReport(queryString.parse(location.search));
    };

    fetchData();
    return () => fetchData();
  }, [getInvoiceReport, location.search]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  const columns = [
    {
      title: "ပစ္စည်းရောင်းရငွေစုစုပေါင်း",
      dataIndex: "sale_total",
    },
    {
      title: "ပစ္စည်းအရင်းစုစုပေါင်း",
      dataIndex: "buy_total",
      render: (buyTotal) => <span style={{ color: "red" }}>{buyTotal}</span>,
    },
    {
      title: "ဝန်ထမ်းလစာစုစုပေါင်း",
      dataIndex: "staff_salary",
      render: (staffSalary) => (
        <span style={{ color: "red" }}>{staffSalary}</span>
      ),
    },
    {
      title: "အထွေထွေကုန်ကျငွေစုစုပေါင်း",
      dataIndex: "expense_total",
      render: (expenseTotal) => (
        <span style={{ color: "red" }}>{expenseTotal}</span>
      ),
    },
    {
      title: "အမြတ်စုစုပေါင်း",
      dataIndex: "profit",
    },
  ];

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title level={3}>Profit Report</Title>
          <RangePicker
            onChange={(val) => {
              window.location = `/admin/profit-report?start_date=${dayjs(
                val[0]
              ).format("YYYY-MM-DD")}&end_date=${dayjs(val[1]).format(
                "YYYY-MM-DD"
              )}`;
            }}
          />
          <Table
            bordered
            columns={columns}
            dataSource={sale.saleReport}
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
  sale: store.sale,
});

export default connect(mapStateToProps, {
  getInvoiceReport,
})(ProfitReport);
