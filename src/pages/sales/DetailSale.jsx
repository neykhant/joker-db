import React, { useEffect, useState } from "react";
import { Space, Typography, Table, message, Spin } from "antd";
import Layout from "antd/lib/layout/layout";
import { connect } from "react-redux";
import { getInvoice } from "../../store/actions";
import { useParams } from "react-router-dom";
import { getReadableDateDisplay } from "../../util/convertToHumanReadableTime";

const { Title } = Typography;

const DetailSale = ({ status, error, sale, getInvoice }) => {
  const [credits, setCredits] = useState([]);
  const [items, setItems] = useState([]);
  const param = useParams();

  useEffect(() => {
    const fetchData = async () => {
      await getInvoice(param.id);
    };

    fetchData();
    return () => fetchData();
  }, [getInvoice, param.id]);

  useEffect(() => {
    const transfromCredits = sale.sale.credits?.map((credit) => {
      return {
        ...credit,
        key: credit.id,
      };
    });

    const transfromItems = sale.sale.items?.map((item) => {
      return {
        ...item,
        key: item.id,
      };
    });
    setCredits(transfromCredits);
    setItems(transfromItems);
  }, [sale.sale]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  const itemColumns = [
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
    },
    {
      title: "စုစုပေါင်း",
      dataIndex: "subtotal",
    },
  ];

  const creditColumns = [
    {
      title: "ပမာဏ",
      dataIndex: "amount",
    },
    {
      title: "ရက်စွဲ",
      dataIndex: "created_at",
      render: (createdAt) => getReadableDateDisplay(createdAt),
    },
  ];

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Title style={{ textAlign: "center" }} level={4}>
            ဘောက်ချာတစ်ခုအသေးစိတ်
          </Title>
          <Title style={{ textAlign: "center" }} level={4}>
            {sale.sale?.customer_name}({sale.sale?.customer_phone_no})
          </Title>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
            size="large"
          >
            <Title level={4}>ရက်စွဲ - </Title>
            <Title level={4}>
              {getReadableDateDisplay(sale.sale?.created_at)}
            </Title>
          </Space>
          <Table
            bordered
            columns={itemColumns}
            dataSource={items}
            pagination={{ position: ["none", "none"] }}
          />
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
            size="large"
          >
            <Title level={4}>စုစုပေါင်း - </Title>
            <Title level={4}>{sale.sale?.total} Ks</Title>
          </Space>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
            size="large"
          >
            <Title level={4}>ဒစ်စကောင့် - </Title>
            <Title level={4}>{sale.sale?.discount} %</Title>
          </Space>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
            size="large"
          >
            <Title level={4}>ပေးရန်စုစုပေါင်း - </Title>
            <Title level={4}>{sale.sale?.final_total} Ks</Title>
          </Space>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
            size="large"
          >
            <Title level={4}>ပေးပြီးငွေစုစုပေါင်း - </Title>
            <Title level={4}>{sale.sale?.paid} Ks</Title>
          </Space>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
            size="large"
          >
            <Title level={4}>ပေးရန်ကျန်ငွေစုစုပေါင်း - </Title>
            <Title level={4}>{sale.sale?.credit} Ks</Title>
          </Space>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
            size="large"
          >
            <Title level={4}>ငွေပေးချေသည့်နည်းလမ်း - </Title>
            <Title level={4}>{sale.sale?.payment_method} Ks</Title>
          </Space>

          <Table
            bordered
            columns={creditColumns}
            dataSource={credits}
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
  getInvoice,
})(DetailSale);
