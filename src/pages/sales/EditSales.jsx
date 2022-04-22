import React, { useEffect, useState } from "react";

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
} from "antd";
import {
  PlusSquareOutlined,
  DeleteOutlined,
  SaveOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import Sider from "antd/lib/layout/Sider";
import { items } from "../../mock";
import { useParams } from "react-router-dom";
import { invoices } from "../../mock";

const { Header, Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

const EditSales = () => {
  const [sale, setSale] = useState(null);

  const param = useParams();

  useEffect(() => {
    const invoice = invoices.find((invoice) => invoice.id === Number(param.id));

    const transformSingleSales = invoice.single_sales.map(
      (singleSale, index) => {
        return {
          ...singleSale,
          key: index + 1,
        };
      }
    );

    setSale({ ...invoice, single_sales: transformSingleSales });
  }, [param]);

  const handleAddSaleItem = (item) => {
    const index = sale.single_sales.findIndex(
      (singleSale) => singleSale.item_id === item.id
    );
    if (index === -1) {
      const singleSale = {
        key:
          sale.single_sales.length === 0
            ? 1
            : sale.single_sales[sale.single_sales.length - 1].id + 1,
        id:
          sale.single_sales.length === 0
            ? 1
            : sale.single_sales[sale.single_sales.length - 1].id + 1,
        item_id: item.id,
        item_code: item.code,
        item_name: item.name,
        price: item.price,
        quantity: 1,
        subtotal: item.price * 1,
      };

      setSale({ ...sale, single_sales: [...sale.single_sales, singleSale] });
    } else {
      let singleSales = [...sale.single_sales];

      singleSales[index] = {
        ...singleSales[index],
        quantity: singleSales[index].quantity + 1,
        subtotal: singleSales[index].price * (singleSales[index].quantity + 1),
      };
      setSale({ ...sale, single_sales: singleSales });
    }
  };

  const handleDelete = (record) => {
    const filterSingleSales = sale.single_sales.filter(
      (singleSale) => singleSale !== record
    );
    const transformSingleSales = filterSingleSales.map((singleSale, index) => {
      return {
        ...singleSale,
        id: index + 1,
        key: index + 1,
      };
    });
    setSale({ ...sale, single_sales: transformSingleSales });
  };

  const handleQuantityOnChange = (value, record) => {
    const index = sale.single_sales.findIndex(
      (singleSale) => singleSale === record
    );
    let singleSales = [...sale.single_sales];

    singleSales[index] = {
      ...singleSales[index],
      quantity: value,
      subtotal: singleSales[index].price * value,
    };
    setSale({ ...sale, single_sales: singleSales });
  };

  const saleItemsTotal =
    sale?.single_sales.length > 0
      ? sale?.single_sales
          .map((singleSale) => singleSale.subtotal)
          .reduce((a, b) => a + b)
      : 0;

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

  return (
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
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                allowClear={true}
                size="large"
                style={{ borderRadius: "10px" }}
              >
                <Option value="Mg Mg">Mg Mg</Option>
                <Option value="Kyaw Kyaw">Kyaw Kyaw</Option>
                <Option value="Ko Ko">Ko Ko</Option>
              </Select>
            </Space>
          </Col>
          <Col xl={{ span: 2 }}></Col>
          <Col xl={{ span: 4 }}>
            <Space>
              <Text
                style={{
                  backgroundColor: "var(--primary-color)",
                  padding: "10px",
                  color: "var(--white-color)",
                }}
              >
                စုစုပေါင်းပွိုင့်
              </Text>
              <Input
                defaultValue={200}
                size="large"
                disabled
                style={{
                  width: "100px",
                  backgroundColor: "var(--white-color)",
                  color: "var(--black-color)",
                }}
              />
            </Space>
          </Col>
          <Col xl={{ span: 4 }}>
            <Space>
              <Text
                style={{
                  backgroundColor: "var(--primary-color)",
                  padding: "10px",
                  color: "var(--white-color)",
                }}
              >
                ရရှိမည့်ပွိုင့်
              </Text>
              <Input
                defaultValue={10}
                size="large"
                disabled
                style={{
                  width: "100px",
                  backgroundColor: "var(--white-color)",
                  color: "var(--black-color)",
                }}
              />
            </Space>
          </Col>
          <Col xl={{ span: 3 }}>
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
            {items.map((item) => (
              <Col key={item.id}>
                <Space
                  direction="vertical"
                  style={{
                    width: "100%",
                    alignItems: "center",
                    backgroundColor: "var(--white-color)",
                  }}
                  onClick={() => handleAddSaleItem(item)}
                >
                  <Text
                    style={{
                      backgroundColor: "var(--primary-color)",
                      color: "var(--white-color)",
                      padding: "0 10px",
                    }}
                  >
                    {item.code}
                  </Text>
                  <Image
                    width={130}
                    preview={false}
                    src={`${window.location.origin}/image.png`}
                  />
                  <Text style={{ color: "var(--black-color)" }}>
                    {item.name}
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
              dataSource={sale?.single_sales}
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
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={15} style={{ textAlign: "right" }}>
                <Title level={5}>ပေးချေရမည့်စုစုပေါင်း</Title>
              </Col>
              <Col span={3}></Col>
              <Col span={3} style={{ textAlign: "right" }}>
                <Title level={5}>4000</Title>
              </Col>
              <Col span={3}></Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={15} style={{ textAlign: "right" }}>
                <Title level={5}>ပေးငွေ</Title>
              </Col>
              <Col span={3}></Col>
              <Col span={3} style={{ textAlign: "right" }}>
                <Title level={5}>2000</Title>
              </Col>
              <Col span={3}></Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={15} style={{ textAlign: "right" }}>
                <Title level={5}>ပေးရန်ကျန်ငွေ</Title>
              </Col>
              <Col span={3}></Col>
              <Col span={3} style={{ textAlign: "right" }}>
                <Title level={5}>2000</Title>
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
                  <Input size="large" />
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
                  <Input size="large" />
                </Space>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ padding: "20px" }}>
              <Col xl={{ span: 6 }}>
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
              <Col xl={{ span: 3 }}></Col>
              <Col xl={{ span: 6 }}>
                <Space direction="vertical">
                  <Text
                    style={{
                      backgroundColor: "var(--primary-color)",
                      padding: "10px",
                      color: "var(--white-color)",
                    }}
                  >
                    ရောင်းသူအမည်
                  </Text>
                  <Select
                    showSearch
                    placeholder="ရောင်းသူအမည်ရွေးပါ"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    allowClear={true}
                    size="large"
                    style={{ borderRadius: "10px" }}
                  >
                    <Option value="Kyaw Kyaw">Kyaw Kyaw</Option>
                    <Option value="Mg Mg">Mg Mg</Option>
                    <Option value="Ko Ko">Ko Ko</Option>
                  </Select>
                </Space>
              </Col>
              <Col xl={{ span: 3 }}></Col>
              <Col xl={{ span: 6 }}>
                <Space direction="vertical">
                  <Text
                    style={{
                      backgroundColor: "var(--primary-color)",
                      padding: "10px",
                      color: "var(--white-color)",
                    }}
                  >
                    ဆိုင်ခွဲအမည်
                  </Text>
                  <Select
                    showSearch
                    placeholder="ဆိုင်ခွဲအမည်ရွေးပါ"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    allowClear={true}
                    size="large"
                    style={{ borderRadius: "10px" }}
                  >
                    <Option value="Shop(1)">Shop(1)</Option>
                    <Option value="Shop(2)">Shop(2)</Option>
                    <Option value="Shop(3)">Shop(3)</Option>
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
  );
};

export default EditSales;
