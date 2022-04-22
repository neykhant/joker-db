import React, { useEffect, useState } from "react";
import { Space, Typography, Table, message, Spin } from "antd";
import Layout from "antd/lib/layout/layout";
import { connect } from "react-redux";
import { getPurchase } from "../../store/actions";
import { useParams } from "react-router-dom";
import { getReadableDateDisplay } from "../../util/convertToHumanReadableTime";

const { Title } = Typography;

const DetailBuyMerchant = ({ status, error, purchase, getPurchase }) => {
  const [credits, setCredits] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const param = useParams();

  useEffect(() => {
    const fetchData = async () => {
      await getPurchase(param.id);
    };

    fetchData();
    return () => fetchData();
  }, [getPurchase, param.id]);

  useEffect(() => {
    const transfromCredits = purchase.purchase.purchase_credits?.map(
      (credit) => {
        return {
          ...credit,
          key: credit.id,
        };
      }
    );

    const transfromPurchaseItems = purchase.purchase.purchase_items?.map(
      (item) => {
        return {
          ...item,
          key: item.id,
        };
      }
    );
    setCredits(transfromCredits);
    setPurchaseItems(transfromPurchaseItems);
  }, [purchase.purchase]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  const purchaseItemColumns = [
    {
      title: "ပစ္စည်းအမည်",
      dataIndex: "item",
      render: (item) => `${item?.item_name?.name}(${item.size})(${item.color})`,
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
            ကုန်ဝယ်စာရင်းတစ်ခုအသေးစိတ်
          </Title>
          <Title style={{ textAlign: "center" }} level={4}>
            {purchase.purchase.merchant?.name}(
            {purchase.purchase.merchant?.company_name})
          </Title>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
            size="large"
          >
            <Title level={4}>ရက်စွဲ - </Title>
            <Title level={4}>
              {getReadableDateDisplay(purchase.purchase?.created_at)}
            </Title>
          </Space>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
            size="large"
          >
            <Title level={4}>စုစုပေါင်း - </Title>
            <Title level={4}>{purchase.purchase?.whole_total} Ks</Title>
          </Space>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
            size="large"
          >
            <Title level={4}>ပေးပြီးငွေစုစုပေါင်း - </Title>
            <Title level={4}>{purchase.purchase?.paid} Ks</Title>
          </Space>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "right" }}
            size="large"
          >
            <Title level={4}>ပေးရန်ကျန်ငွေစုစုပေါင်း - </Title>
            <Title level={4}>{purchase.purchase?.credit} Ks</Title>
          </Space>

          <Table
            bordered
            columns={purchaseItemColumns}
            dataSource={purchaseItems}
            pagination={{ position: ["none", "none"] }}
          />

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
  purchase: store.purchase,
});

export default connect(mapStateToProps, {
  getPurchase,
})(DetailBuyMerchant);
