import React, { useEffect, useState } from "react";
import dateFormat from "dateformat";
// ant design styles
import {
  Layout,
  Row,
  Col,
  Select,
  Space,
  Typography,
  Input,
  Button,
  Image,
  Table,
  InputNumber,
  message,
  Spin,
} from "antd";
import {
  PlusSquareOutlined,
  DeleteOutlined,
  SaveOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import Sider from "antd/lib/layout/Sider";
import { connect } from "react-redux";
import { getStocks, getMembers, createInvoice } from "../../store/actions";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

const CreateSales = ({
  status,
  error,
  stock,
  getStocks,
  member,
  getMembers,
  createInvoice,
  sale,
}) => {
  const [saleItems, setSaleItems] = useState([]);
  const [memberId, setMemberId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState(0);
  const [payMethod, setPayMethod] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await getStocks();
      await getMembers();
    };

    fetchData();
    return () => fetchData();
  }, [getStocks, getMembers]);

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  useEffect(() => {
    if (status.success) {
      setSaleItems([]);
      setMemberId(null);
      setCustomerName("");
      setCustomerPhone("");
      setDiscount(0);
      setPaid(0);
      setPayMethod(undefined);
      getStocks();
      message.success(
        "အရောင်းဘောင်ချာသိမ်းပြီးပါပြီ။ ဘောင်ချာထုတ်ရန် print button ကိုနှိပ်ပါ။"
      );
    }

    return () => status.success;
  }, [status.success, getStocks]);

  const handleSelectMember = (value) => {
    if (value === undefined) {
      setMemberId(null);
    } else {
      const findMember = member.members.find((member) => member.id === value);
      setMemberId(value);
      setCustomerName(findMember.name);
      setCustomerPhone(findMember.phone);
    }
  };

  const handleAddSaleItem = (stock) => {
    const index = saleItems.findIndex(
      (saleItem) => saleItem.stock_id === stock.id
    );
    if (index === -1) {
      if (stock.quantity > 0) {
        const saleItem = {
          key:
            saleItems.length === 0 ? 1 : saleItems[saleItems.length - 1].id + 1,
          id:
            saleItems.length === 0 ? 1 : saleItems[saleItems.length - 1].id + 1,
          stock_id: stock.id,
          item_code: stock.item.code,
          item_name: `${stock.item.item_name.name}(${stock.item.size})(${stock.item.color})`,
          capital: stock.item.buy_price,
          price: stock.item.sale_price,
          quantity: 1,
          subtotal: stock.item.sale_price * 1,
        };

        setSaleItems([...saleItems, saleItem]);
      } else {
        message.warning("လက်ကျန်မရှိတော့ပါ။");
      }
    } else {
      let cloneSaleItems = [...saleItems];

      if (cloneSaleItems[index].quantity + 1 <= stock.quantity) {
        cloneSaleItems[index] = {
          ...cloneSaleItems[index],
          quantity: cloneSaleItems[index].quantity + 1,
          subtotal:
            cloneSaleItems[index].price * (cloneSaleItems[index].quantity + 1),
        };
        setSaleItems(cloneSaleItems);
      } else {
        message.warning("လက်ကျန်မရှိတော့ပါ။");
      }
    }
  };

  const handleDelete = (record) => {
    const filterSaleItems = saleItems.filter((saleItem) => saleItem !== record);
    const transformSaleItems = filterSaleItems.map((saleItem, index) => {
      return {
        ...saleItem,
        id: index + 1,
        key: index + 1,
      };
    });
    setSaleItems(transformSaleItems);
  };

  const handleQuantityOnChange = (value, record) => {
    const index = saleItems.findIndex((saleItem) => saleItem === record);
    let cloneSaleItems = [...saleItems];

    cloneSaleItems[index] = {
      ...cloneSaleItems[index],
      quantity: value,
      subtotal: cloneSaleItems[index].price * value,
    };
    setSaleItems(cloneSaleItems);
  };

  const saleItemsTotal =
    saleItems.length > 0
      ? saleItems.map((saleItem) => saleItem.subtotal).reduce((a, b) => a + b)
      : 0;

  const discountAmount = saleItemsTotal * (discount / 100);

  const finalTotal = saleItemsTotal - discountAmount;

  const credit = finalTotal - paid;

  const columns = [
    {
      title: "စဥ်",
      dataIndex: "id",
    },
    {
      title: "ပစ္စည်းကုတ်",
      dataIndex: "item_code",
    },
    {
      title: "ပစ္စည်းအမည်",
      dataIndex: "item_name",
    },
    {
      title: "ဈေးနှုန်း",
      dataIndex: "price",
      align: "right",
    },
    {
      title: "အရေအတွက်",
      dataIndex: "quantity",
      align: "right",
      render: (_, record) => (
        <InputNumber
          value={record.quantity}
          onChange={(value) => handleQuantityOnChange(value, record)}
          style={{
            width: "100px",
            backgroundColor: "var(--white-color)",
            color: "var(--black-color)",
          }}
        />
      ),
    },
    {
      title: "ကျသင့်ငွေ",
      dataIndex: "subtotal",
      align: "right",
    },
    {
      title: "",
      dataIndex: "action",
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleDelete(record)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  const handleSale = async () => {
    if (saleItems.length === 0) {
      message.error("ကျေးဇူးပြု၍အဝယ်ပစ္စည်းများထည့်ပါ");
    } else if (customerName === "") {
      message.error("ကျေးဇူးပြု၍ဝယ်ယူသူအမည်ထည့်ပါ");
    } else if (customerPhone === "") {
      message.error("ကျေးဇူးပြု၍ဝယ်ယူသူဖုန်းနံပါတ်ထည့်ပါ");
    } else if (payMethod === undefined) {
      message.error("ကျေးဇူးပြု၍ငွေချေရမည့်နည်းလမ်းထည့်ပါ");
    } else {
      let items = [];
      let buyTotal = 0;
      let total = 0;

      saleItems.forEach((saleItem) => {
        buyTotal += Number(saleItem.capital) * Number(saleItem.quantity);
        total += Number(saleItem.subtotal);
        items.push({
          stock_id: saleItem.stock_id,
          price: saleItem.price,
          quantity: saleItem.quantity,
        });
      });

      const now = new Date();
      const date = dateFormat(now, "yyyy-mm-dd");

      let savedData = {
        date: date,
        items: items,
        buy_total: buyTotal,
        total: total,
        discount: discount,
        paid: paid,
        payment_method: payMethod,
        customer_name: customerName,
        customer_phone_no: customerPhone,
      };

      if (memberId !== undefined) {
        savedData = {
          ...savedData,
          member_id: Number(memberId),
        };
      }

      await createInvoice(savedData);
    }
  };

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
            အရောင်း‌ဘောင်ချာဖွင့်ခြင်း
          </Title>
        </Header>
        <Layout
          style={{ backgroundColor: "var(--white-color)", padding: "10px" }}
        >
          <Row gutter={[16, 16]}>
            <Col
              xl={{
                span: 4,
              }}
            >
              <Space>
                <Text
                  style={{
                    backgroundColor: "var(--primary-color)",
                    padding: "10px",
                    color: "var(--white-color)",
                  }}
                >
                  Barcode
                </Text>
                <Input
                  placeholder="Scan Item"
                  size="large"
                  style={{ width: "130px" }}
                />
              </Space>
            </Col>
            <Col xl={{ span: 7 }}>
              <Space>
                <Text
                  style={{
                    backgroundColor: "var(--primary-color)",
                    padding: "10px",
                    color: "var(--white-color)",
                  }}
                >
                  Member Name
                </Text>
                <Select
                  showSearch
                  placeholder="ကုန်သည်အမည်ရွေးပါ"
                  optionFilterProp="children"
                  onChange={handleSelectMember}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  allowClear={true}
                  size="large"
                  style={{ borderRadius: "10px" }}
                >
                  {member.members.map((member) => (
                    <Option key={member.id} value={member.id}>
                      {member.name}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
            <Col xl={{ span: 2 }}></Col>
            <Col xl={{ span: 12 }}>
              <Button
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--white-color)",
                }}
                size="large"
              >
                <PlusSquareOutlined />
                New Member
              </Button>
            </Col>
          </Row>
        </Layout>
        <Layout style={{ display: "flex", flexDirection: "row" }}>
          <Sider
            width={335}
            style={{
              backgroundColor: "var(--info-color)",
              padding: "20px",
              height: "520px",
              overflow: "auto",
            }}
          >
            <Row gutter={[16, 16]}>
              {stock.stocks.map((stock) => (
                <Col key={stock.id}>
                  <Space
                    direction="vertical"
                    style={{
                      width: "100%",
                      alignItems: "center",
                      backgroundColor: "var(--white-color)",
                    }}
                    onClick={() => handleAddSaleItem(stock)}
                  >
                    <Text
                      style={{
                        backgroundColor: "var(--primary-color)",
                        color: "var(--white-color)",
                        padding: "0 10px",
                      }}
                    >
                      {stock?.item?.code}
                    </Text>
                    <Image
                      width={130}
                      preview={false}
                      src={stock?.item?.image}
                    />
                    <Text style={{ color: "var(--black-color)" }}>
                      {stock?.item?.item_name?.name}({stock?.item?.size})(
                      {stock?.item?.color})({stock?.quantity})
                    </Text>
                  </Space>
                </Col>
              ))}
            </Row>
          </Sider>
          <Content
            style={{
              minHeight: "520px",
              backgroundColor: "var(--muted-color)",
            }}
          >
            <Layout>
              <Table
                bordered
                columns={columns}
                dataSource={saleItems}
                pagination={{ position: ["none", "none"] }}
              />
              <Row gutter={[16, 16]}>
                <Col span={15} style={{ textAlign: "right" }}>
                  <Title level={5}>စုစုပေါင်း</Title>
                </Col>
                <Col span={3}></Col>
                <Col span={3} style={{ textAlign: "right" }}>
                  <Title level={5}>{saleItemsTotal}</Title>
                </Col>
                <Col span={3}></Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={15} style={{ textAlign: "right" }}>
                  <Title level={5}>လျော့ဈေး</Title>
                </Col>
                <Col span={3} style={{ textAlign: "center" }}>
                  <InputNumber
                    min={0}
                    value={discount}
                    onChange={(value) => setDiscount(value)}
                    addonAfter="%"
                    style={{
                      width: "100px",
                      backgroundColor: "var(--white-color)",
                      color: "var(--black-color)",
                    }}
                  />
                </Col>
                <Col span={3} style={{ textAlign: "right" }}>
                  <Title level={5}>{discountAmount}</Title>
                </Col>
                <Col span={3}></Col>
              </Row>
              {/* <Row gutter={[16, 16]}>
                <Col span={15} style={{ textAlign: "right" }}>
                  <Title level={5}>အခွန်</Title>
                </Col>
                <Col span={3} style={{ textAlign: "center" }}>
                  <Input
                    defaultValue={10}
                    addonAfter="%"
                    style={{
                      width: "100px",
                      backgroundColor: "var(--white-color)",
                      color: "var(--black-color)",
                    }}
                  />
                </Col>
                <Col span={3} style={{ textAlign: "right" }}>
                  <Title level={5}>500</Title>
                </Col>
                <Col span={3}></Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={15} style={{ textAlign: "right" }}>
                  <Title level={5}>ပွိုင့်ဖြင့်ဝယ်ယူခြင်း</Title>
                </Col>
                <Col span={3} style={{ textAlign: "center" }}>
                  <Input
                    defaultValue={10}
                    style={{
                      width: "100px",
                      backgroundColor: "var(--white-color)",
                      color: "var(--black-color)",
                    }}
                  />
                </Col>
                <Col span={3} style={{ textAlign: "right" }}>
                  <Title level={5}>1000</Title>
                </Col>
                <Col span={3}></Col>
              </Row> */}
              <Row gutter={[16, 16]}>
                <Col span={15} style={{ textAlign: "right" }}>
                  <Title level={5}>ပေးချေရမည့်စုစုပေါင်း</Title>
                </Col>
                <Col span={3}></Col>
                <Col span={3} style={{ textAlign: "right" }}>
                  <Title level={5}>{finalTotal}</Title>
                </Col>
                <Col span={3}></Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={15} style={{ textAlign: "right" }}>
                  <Title level={5}>ပေးငွေ</Title>
                </Col>
                <Col span={3}></Col>
                <Col span={3} style={{ textAlign: "right" }}>
                  <Title level={5}>
                    <InputNumber
                      min={0}
                      value={paid}
                      onChange={(value) => setPaid(value)}
                      style={{
                        width: "100px",
                        backgroundColor: "var(--white-color)",
                        color: "var(--black-color)",
                      }}
                    />
                  </Title>
                </Col>
                <Col span={3}></Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={15} style={{ textAlign: "right" }}>
                  <Title level={5}>ပေးရန်ကျန်ငွေ</Title>
                </Col>
                <Col span={3}></Col>
                <Col span={3} style={{ textAlign: "right" }}>
                  <Title level={5}>{credit}</Title>
                </Col>
                <Col span={3}></Col>
              </Row>
              <Row gutter={[16, 16]} style={{ padding: "20px" }}>
                <Col xl={{ span: 10 }}>
                  <Space>
                    <Text
                      style={{
                        backgroundColor: "var(--primary-color)",
                        padding: "10px",
                        color: "var(--white-color)",
                      }}
                    >
                      ဝယ်ယူသူအမည်
                    </Text>
                    <Input
                      size="large"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                    />
                  </Space>
                </Col>
                <Col xl={{ span: 4 }}></Col>
                <Col xl={{ span: 10 }}>
                  <Space>
                    <Text
                      style={{
                        backgroundColor: "var(--primary-color)",
                        padding: "10px",
                        color: "var(--white-color)",
                      }}
                    >
                      ဝယ်ယူသူဖုန်းနံပါတ်
                    </Text>
                    <Input
                      size="large"
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.target.value)}
                    />
                  </Space>
                </Col>
              </Row>
              <Row gutter={[16, 16]} style={{ padding: "20px" }}>
                <Col xl={{ span: 24 }}>
                  <Space direction="vertical">
                    <Text
                      style={{
                        backgroundColor: "var(--primary-color)",
                        padding: "10px",
                        color: "var(--white-color)",
                      }}
                    >
                      ငွေချေရမည့်နည်းလမ်း
                    </Text>
                    <Select
                      showSearch
                      placeholder="ငွေချေနည်းရွေးပါ"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={(value) => setPayMethod(value)}
                      allowClear={true}
                      size="large"
                      style={{ borderRadius: "10px" }}
                    >
                      <Option value="KBZ">KBZ</Option>
                      <Option value="AYA">AYA</Option>
                      <Option value="CB">CB</Option>
                    </Select>
                  </Space>
                </Col>
              </Row>
              <Row gutter={[16, 16]} style={{ padding: "20px" }}>
                <Col span={10} style={{ textAlign: "center" }}>
                  <Button
                    style={{
                      backgroundColor: "var(--primary-color)",
                      color: "var(--white-color)",
                    }}
                    size="large"
                    onClick={handleSale}
                  >
                    <SaveOutlined />
                    Save
                  </Button>
                </Col>
                <Col span={4}></Col>
                <Col span={10} style={{ textAlign: "center" }}>
                  <Button
                    style={{
                      backgroundColor: "var(--primary-color)",
                      color: "var(--white-color)",
                    }}
                    size="large"
                    onClick={() =>
                      navigate(`/admin/print-sale/${sale.sale.id}`)
                    }
                  >
                    <PrinterOutlined />
                    Print
                  </Button>
                </Col>
              </Row>
            </Layout>
          </Content>
        </Layout>
      </Layout>
    </Spin>
  );
};
const mapStateToProps = (store) => ({
  status: store.status,
  error: store.error,
  stock: store.stock,
  member: store.member,
  sale: store.sale,
});

export default connect(mapStateToProps, {
  getStocks,
  getMembers,
  createInvoice,
})(CreateSales);
