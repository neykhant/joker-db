import React, { useEffect, useState } from "react";
import {
  Typography,
  Space,
  Row,
  Col,
  Button,
  Table,
  Select,
  message,
  Spin,
  Popconfirm,
} from "antd";
import Layout from "antd/lib/layout/layout";
import { PlusSquareOutlined, ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import {
  getMerchants,
  getPurchases,
  deletePurchase,
} from "../../store/actions";
import { getReadableDateDisplay } from "../../util/convertToHumanReadableTime";
import { successDeleteMessage } from "../../util/messages";
import { Positions } from "../../util/positions";

const { Title, Text } = Typography;
const { Option } = Select;

const ShowBuyMerchants = ({
  status,
  error,
  auth,
  purchase,
  merchant,
  getMerchants,
  getPurchases,
  deletePurchase,
}) => {
  const [filterPurchases, setFilterPurchases] = useState([]);
  const navigate = useNavigate();

  const onChange = (value) => {
    if (value === undefined) {
      setFilterPurchases(purchase.purchases);
    } else {
      const data = purchase.purchases.filter(
        (purchase) => purchase.merchant.id === value
      );

      setFilterPurchases(data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getMerchants();
      await getPurchases();
    };
    fetchData();
    return () => {
      fetchData();
    };
  }, [getMerchants, getPurchases]);

  useEffect(() => {
    setFilterPurchases(purchase.purchases);
  }, [purchase.purchases]);

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
    await deletePurchase(id);
  };

  let credits = 0;
  filterPurchases.forEach((data) => {
    credits += Number(data.credit);
  });

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
        title: "ကုန်သည်လုပ်ငန်းအမည်",
        dataIndex: "merchant",
        render: (merchant) => merchant.company_name,
      },
      {
        title: "ပေးချေပြီးပမာဏ",
        dataIndex: "paid",
      },
      {
        title: "ပေးရန်ကျန်ငွေ",
        dataIndex: "credit",
      },
      {
        title: "အကြွေးဆပ်ခြင်း",
        dataIndex: "id",
        render: (id) => (
          <Button
            type="primary"
            style={{ backgroundColor: "#ad6800", borderColor: "#ad6800" }}
            onClick={() => navigate(`/admin/create-buy-credits/${id}`)}
          >
            အကြွေးပေးရန်
          </Button>
        ),
      },
      {
        title: "Actions",
        dataIndex: "id",
        render: (id) => (
          <Space direction="horizontal">
            <Button
              type="primary"
              onClick={() => navigate(`/admin/detail-buy-merchants/${id}`)}
            >
              Detail
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
  } else {
    columns = [
      {
        title: "ရက်စွဲ",
        dataIndex: "created_at",
        render: (createdAt) => getReadableDateDisplay(createdAt),
      },
      {
        title: "ကုန်သည်လုပ်ငန်းအမည်",
        dataIndex: "merchant",
        render: (merchant) => merchant.company_name,
      },
      {
        title: "ပေးချေပြီးပမာဏ",
        dataIndex: "paid",
      },
      {
        title: "ပေးရန်ကျန်ငွေ",
        dataIndex: "credit",
      },
      {
        title: "Actions",
        dataIndex: "id",
        render: (id) => (
          <Space direction="horizontal">
            <Button
              type="primary"
              onClick={() => navigate(`/admin/detail-buy-merchants/${id}`)}
            >
              Detail
            </Button>
          </Space>
        ),
      },
    ];
  }

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 18 }}>
              <Title level={3}>ကုန်သည်အဝယ်စာရင်း</Title>
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
                  onClick={() => navigate("/admin/create-buy-merchants")}
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
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 15 }}>
              <Space
                direction="horizontal"
                style={{
                  width: "100%",
                  marginBottom: "10px",
                }}
                size="large"
              >
                <Text type="secondary">ကုန်သည်လုပ်ငန်းအမည်ရွေးပါ</Text>
                <Select
                  showSearch
                  placeholder="ကျေးဇူးပြု၍ ကုန်သည်လုပ်ငန်းအမည်ရွေးပါ"
                  optionFilterProp="children"
                  onChange={onChange}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  allowClear={true}
                  size="large"
                  style={{ borderRadius: "10px" }}
                >
                  {merchant.merchants.map((mer) => (
                    <Option key={mer.id} value={mer.id}>
                      {mer.company_name}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
            <Col xl={{ span: 9 }}>
              <Space
                direction="horizontal"
                style={{ width: "100%", justifyContent: "right" }}
                size="large"
              >
                <Title level={4}>ပေးရန်ကျန်ငွေစုစုပေါင်း - </Title>
                <Title level={4}>{credits} Ks</Title>
              </Space>
            </Col>
          </Row>
          <Table
            bordered
            columns={columns}
            pagination={{ defaultPageSize: 10 }}
            dataSource={filterPurchases}
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
  purchase: store.purchase,
  merchant: store.merchant,
});

export default connect(mapStateToProps, {
  getMerchants,
  getPurchases,
  deletePurchase,
})(ShowBuyMerchants);
