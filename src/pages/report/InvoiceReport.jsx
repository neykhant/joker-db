import React, { useEffect } from "react";
import {
  Typography,
  Space,
  Row,
  Col,
  Button,
  Table,
  DatePicker,
  Spin,
  message,
  Popconfirm,
} from "antd";
import Layout from "antd/lib/layout/layout";
import { connect } from "react-redux";
import queryString from "query-string";
import dayjs from "dayjs";
import { getInvoices, deleteInvoice } from "../../store/actions";
import { getReadableDateDisplay } from "../../util/convertToHumanReadableTime";
import { successDeleteMessage } from "../../util/messages";
import { useLocation, useNavigate } from "react-router-dom";
import { Positions } from "../../util/positions";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const InvoiceReport = ({
  status,
  error,
  auth,
  sale,
  getInvoices,
  deleteInvoice,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      await getInvoices(queryString.parse(location.search));
    };
    fetchData();
    return () => {
      fetchData();
    };
  }, [getInvoices, location.search]);

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
    await deleteInvoice(id);
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
        title: "ဘောင်ချာကုတ်",
        dataIndex: "voucher_code",
      },
      {
        title: "ဝယ်သူအမည်",
        dataIndex: "customer_name",
      },
      {
        title: "ဝယ်ယူသောပမာဏ",
        dataIndex: "final_total",
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: "ပေးချေပြီးသောပမာဏ",
        dataIndex: "paid",
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: "ပေးရန်ကျန်ငွေ",
        dataIndex: "credit",
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: "အကြွေးဆပ်ခြင်း",
        dataIndex: "id",
        render: (id) => (
          <Button
            type="primary"
            style={{ backgroundColor: "#ad6800", borderColor: "#ad6800" }}
            onClick={() => navigate(`/admin/create-sale-credits/${id}`)}
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
              onClick={() => navigate(`/admin/print-sale/${id}`)}
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
        title: "ဘောင်ချာကုတ်",
        dataIndex: "voucher_code",
      },
      {
        title: "ဝယ်သူအမည်",
        dataIndex: "customer_name",
      },
      {
        title: "ဝယ်ယူသောပမာဏ",
        dataIndex: "final_total",
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: "ပေးချေပြီးသောပမာဏ",
        dataIndex: "paid",
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: "ပေးရန်ကျန်ငွေ",
        dataIndex: "credit",
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: "Actions",
        dataIndex: "id",
        render: (id) => (
          <Space direction="horizontal">
            <Button
              type="primary"
              onClick={() => navigate(`/admin/print-sale/${id}`)}
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
          <Title level={3}>ဘောင်ချာအရောင်းမှတ်တမ်းစာမျက်နှာ</Title>

          <Row gutter={[16, 16]}>
            <Col xl={{ span: 24 }}>
              <RangePicker
                onChange={(val) => {
                  window.location = `/admin/invoice-report?start_date=${dayjs(
                    val[0]
                  ).format("YYYY-MM-DD")}&end_date=${dayjs(val[1]).format(
                    "YYYY-MM-DD"
                  )}`;
                }}
              />
            </Col>
          </Row>

          <Table
            bordered
            columns={columns}
            dataSource={sale.sales}
            pagination={{ defaultPageSize: 10 }}
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
  sale: store.sale,
});

export default connect(mapStateToProps, { getInvoices, deleteInvoice })(
  InvoiceReport
);
