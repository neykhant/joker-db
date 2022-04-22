import React, { useState, useEffect, useRef } from "react";

// ant design styles
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Divider,
  message,
  Spin,
} from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { connect } from "react-redux";
import { getInvoice } from "../../store/actions";
import { getReadableDateDisplay } from "../../util/convertToHumanReadableTime";
import { Positions } from "../../util/positions";

const { Header } = Layout;
const { Title } = Typography;

const PrintSale = ({ status, error, auth, sale, getInvoice }) => {
  const navigate = useNavigate();
  const componentRef = useRef();
  const [items, setItems] = useState([]);

  const param = useParams();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const fetchData = async () => {
      await getInvoice(param.id);
    };

    fetchData();
    return () => fetchData();
  }, [getInvoice, param.id]);

  useEffect(() => {
    const transfromItems = sale.sale.items?.map((item) => {
      return {
        ...item,
        key: item.id,
      };
    });
    setItems(transfromItems);
  }, [sale.sale]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  const columns = [
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

  const discountAmount = sale.sale.total * (sale.sale.discount / 100);

  const handleDashboard = () => {
    navigate("/admin/create-sales");
  };

  const { position } = auth.user;

  return (
    <Spin spinning={status.loading}>
      <Layout>
        <Header style={{ backgroundColor: "var(--primary-color)" }}>
          <Title
            style={{
              color: "var(--white-color)",
              textAlign: "center",
              marginTop: "13px",
            }}
            level={3}
          >
            အရောင်း‌ဘောင်ချာ print ထုတ်ခြင်း
          </Title>
        </Header>
        <Row>
          <Col span={10}></Col>
          <Col span={2} style={{ textAlign: "center" }}>
            <Button
              style={{
                backgroundColor: "var(--primary-color)",
                color: "var(--white-color)",
              }}
              size="large"
              onClick={handlePrint}
            >
              <PrinterOutlined />
              Print
            </Button>
          </Col>
          <Col span={2}>
            {(position === Positions.MANAGER ||
              position === Positions.STAFF) && (
              <Button
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--white-color)",
                }}
                size="large"
                onClick={handleDashboard}
              >
                အရောင်းစာမျက်နှာ
              </Button>
            )}
          </Col>
          <Col span={10}></Col>
        </Row>
        <div style={{ width: "909px", margin: "30px 0px" }} ref={componentRef}>
          <Row gutter={16}>
            <Col className="gutter-row" span={6}></Col>
            <Col
              className="gutter-row"
              span={12}
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              <Title level={2}>Joker</Title>
            </Col>
            <Col className="gutter-row" span={6}></Col>
          </Row>

          <Row>
            <Col span={1}></Col>
            <Col span={11}>
              <Row>
                <Col span={5}>
                  <Title level={5}>Mandalay:</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={18}>
                  <Title level={5}>Joker</Title>
                </Col>
              </Row>
              <Row>
                <Col span={5}>
                  <Title level={5}>ဆိုင်ခွဲ(၁):</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={18}>
                  <Title level={5}>အမှတ်(၁၈၂)၂၉လမ်း၊၇၉x၈၀ကြား</Title>
                </Col>
              </Row>
              <Row>
                <Col span={5}>
                  <Title level={5}>ဖုန်းနံပါတ်:</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={18}>
                  <Title level={5}>09793990086, 024066055</Title>
                </Col>
              </Row>
              <Row>
                <Col span={5}>
                  <Title level={5}>ဆိုင်ခွဲ(၂):</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={18}>
                  <Title level={5}>
                    Block6,Unit15၊၇၃လမ်း၊သဇင်လမ်းနှင့်ငုရွှေဝါလမ်းကြား။မင်္ဂလာမန္တလေး
                  </Title>
                </Col>
              </Row>
              <Row>
                <Col span={5}>
                  <Title level={5}>ဖုန်းနံပါတ်:</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={18}>
                  <Title level={5}>09790888550</Title>
                </Col>
              </Row>
            </Col>
            <Col span={11}>
              <Row>
                <Col span={5}>
                  <Title level={5}>Yangon:</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={18}>
                  <Title level={5}>Joker</Title>
                </Col>
              </Row>
              <Row>
                <Col span={5}>
                  <Title level={5}>ဆိုင်ခွဲ(၁):</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={18}>
                  <Title level={5}>
                    အမှတ်(၃၇)၊ရှင်စောပုဘုရားလမ်း၊စမ်းချောင်းမြို့နယ်။
                  </Title>
                </Col>
              </Row>
              <Row>
                <Col span={5}>
                  <Title level={5}>ဖုန်းနံပါတ်:</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={18}>
                  <Title level={5}>01-539551,09-762408875</Title>
                </Col>
              </Row>
              <Row>
                <Col span={5}>
                  <Title level={5}>ဆိုင်ခွဲ(၂):</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={18}>
                  <Title level={5}>
                    B1(56/57)၊တော်၀င်စင်တာ၊ပြည်လမ်း၊ဒဂုံမြို့နယ်။
                  </Title>
                </Col>
              </Row>
              <Row>
                <Col span={5}>
                  <Title level={5}>ဖုန်းနံပါတ်:</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={18}>
                  <Title level={5}>
                    01-8600111(Ext:1156),09-262437532,09-400600366
                  </Title>
                </Col>
              </Row>
            </Col>
            <Col span={1}></Col>
          </Row>
          <Row>
            <Col span={1}></Col>
            <Col span={22}>
              <Divider
                style={{
                  height: "2px",
                  color: "gray",
                  borderWidth: "0",
                  backgroundColor: "gray",
                }}
              />
            </Col>
            <Col span={1}></Col>
          </Row>
          <Row>
            <Col span={10}></Col>
            <Col span={4}>
              <Title
                level={2}
                style={{
                  marginBottom: "15px",
                  marginTop: "1px",
                  textAlign: "center",
                }}
              >
                Invoice
              </Title>
            </Col>
            <Col span={10}></Col>
          </Row>
          <Row>
            <Col span={1}></Col>
            <Col span={11}>
              <Row>
                <Col span={9}>
                  <Title level={5}>Customer Phone:</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={14}>
                  <Title level={5}>{sale.sale.customer_phone_no}</Title>
                </Col>
              </Row>
              <Row>
                <Col span={9}>
                  <Title level={5}>Customer Name:</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={14}>
                  <Title level={5}>{sale.sale.customer_name}</Title>
                </Col>
              </Row>
            </Col>
            <Col span={11}>
              <Row>
                <Col span={9}>
                  <Title level={5}>Date:</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={14}>
                  <Title level={5}>
                    {getReadableDateDisplay(sale.sale.created_at)}
                  </Title>
                </Col>
              </Row>
              <Row>
                <Col span={9}>
                  <Title level={5}>Voucher Code:</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={14}>
                  <Title level={5}>{sale.sale.voucher_code}</Title>
                </Col>
              </Row>
              <Row>
                <Col span={9}>
                  <Title level={5}>Payment Method:</Title>
                </Col>
                <Col span={1}></Col>
                <Col span={14}>
                  <Title level={5}>{sale.sale.payment_method}</Title>
                </Col>
              </Row>
            </Col>
            <Col span={1}></Col>
          </Row>
          <Table
            bordered
            columns={columns}
            dataSource={items}
            pagination={{ defaultPageSize: 20, position: ["none", "none"] }}
            style={{ margin: "10px 20px" }}
          />
          <Row gutter={[16, 16]}>
            <Col span={17} style={{ textAlign: "right" }}>
              <Title level={5}>စုစုပေါင်း</Title>
            </Col>
            <Col span={1}></Col>
            <Col span={5} style={{ textAlign: "right" }}>
              <Title level={5}>{sale.sale.total}</Title>
            </Col>
            <Col span={1}></Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={17} style={{ textAlign: "right" }}>
              <Title level={5}>လျော့ဈေး</Title>
            </Col>
            <Col span={2} style={{ textAlign: "left" }}>
              <Title level={5}>{sale.sale.discount}%</Title>
            </Col>
            <Col span={4} style={{ textAlign: "right" }}>
              <Title level={5}>{discountAmount}</Title>
            </Col>
            <Col span={1}></Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={17} style={{ textAlign: "right" }}>
              <Title level={5}>ပေးချေရမည့်စုစုပေါင်း</Title>
            </Col>
            <Col span={1}></Col>
            <Col span={5} style={{ textAlign: "right" }}>
              <Title level={5}>{sale.sale.final_total}</Title>
            </Col>
            <Col span={1}></Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={17} style={{ textAlign: "right" }}>
              <Title level={5}>ပေးငွေ</Title>
            </Col>
            <Col span={1}></Col>
            <Col span={5} style={{ textAlign: "right" }}>
              <Title level={5}>{sale.sale.paid}</Title>
            </Col>
            <Col span={1}></Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={17} style={{ textAlign: "right" }}>
              <Title level={5}>ပေးရန်ကျန်ငွေ</Title>
            </Col>
            <Col span={1}></Col>
            <Col span={5} style={{ textAlign: "right" }}>
              <Title level={5}>{sale.sale.credit}</Title>
            </Col>
            <Col span={1}></Col>
          </Row>
        </div>
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

export default connect(mapStateToProps, {
  getInvoice,
})(PrintSale);
