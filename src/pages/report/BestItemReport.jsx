import React, { useEffect } from "react";
import { Typography, Space, Table, DatePicker, message, Spin } from "antd";
import Layout from "antd/lib/layout/layout";
import queryString from "query-string";
import dayjs from "dayjs";
import { connect } from "react-redux";
import { getBestItems } from "../../store/actions";
import { useLocation } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const BestItemReport = ({ status, error, item, getBestItems }) => {
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      await getBestItems(queryString.parse(location.search));
    };
    fetchData();
    return () => fetchData();
  }, [getBestItems, location.search]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  const columns = [
    {
      title: "ပစ္စည်းအမည်",
      dataIndex: "item",
      render: (item) => `${item?.item_name?.name}(${item.size})(${item.color})`,
    },
    {
      title: "အရေအတွက်",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "စုစုပေါင်း",
      dataIndex: "subtotal",
      sorter: (a, b) => a.subtotal - b.subtotal,
    },
  ];

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title level={3}>ရောင်းအားကောင်းသောပစ္စည်းစာရင်း</Title>
          <RangePicker
            onChange={(val) => {
              window.location = `/admin/best-item-report?start_date=${dayjs(
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
            dataSource={item.bestItems}
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
  getBestItems,
})(BestItemReport);
