import React, { useEffect, useState } from "react";
import {
  Link,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
// ant design styles
import { Layout, Menu, Avatar, Space, Popover, Button, message } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";

// ant design icons
import {
  UserOutlined,
  DashboardOutlined,
  UsergroupAddOutlined,
  UnorderedListOutlined,
  SaveOutlined,
  DatabaseOutlined,
  CalculatorOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ShopOutlined,
  FileImageOutlined,
  FileZipOutlined,
} from "@ant-design/icons";
import Dashboard from "../pages/Dashboard";
import SubMenu from "antd/lib/menu/SubMenu";
import CreateMerchants from "../pages/merchants/CreateMerchants";
import ShowMerchants from "../pages/merchants/ShowMerchants";
import CreateMembers from "../pages/members/CreateMembers";
import ShowMembers from "../pages/members/ShowMembers";
import CreateItems from "../pages/items/CreateItems";
import ShowItems from "../pages/items/ShowItems";
import CreateBuyMerchants from "../pages/buy_merchants/CreateBuyMerchants";
import ShowBuyMerchants from "../pages/buy_merchants/ShowBuyMerchants";
import CreateExpenses from "../pages/expenses/CreateExpenses";
import ShowExpenses from "../pages/expenses/ShowExpenses";
import CreateExpenseNames from "../pages/expense_names/CreateExpenseNames";
import ShowExpenseNames from "../pages/expense_names/ShowExpenseNames";
import CreateShops from "../pages/shops/CreateShops";
import ShowShops from "../pages/shops/ShowShops";
import CreateAccounts from "../pages/accounts/CreateAccounts";
import ShowAccounts from "../pages/accounts/ShowAccounts";
import CreateBuyItems from "../pages/buy_items/CreateBuyItems";
import ShowBuyItems from "../pages/buy_items/ShowBuyItems";
import ShowStocks from "../pages/stocks/ShowStocks";
import InvoiceReport from "../pages/report/InvoiceReport";
import SaleItemReport from "../pages/report/SaleItemReport";
import ShowItemTransfers from "../pages/item_transfers/ShowItemTransfers";
import CreateItemTransfers from "../pages/item_transfers/CreateItemTransfers";
import ShowOwnerUsedItems from "../pages/owner_used_items/ShowOwnerUsedItems";
import CreateOwnerUsedItems from "../pages/owner_used_items/CreateOwnerUsedItems";
import ShowDamageItems from "../pages/damage_items/ShowDamageItems";
import CreateDamageItems from "../pages/damage_items/CreateDamageItems";
import ShowItemNames from "../pages/item_names/ShowItemNames";

import { connect } from "react-redux";
import { logout } from "../store/actions";
import EditShops from "../pages/shops/EditShops";
import EditMerchants from "../pages/merchants/EditMerchants";
import EditMembers from "../pages/members/EditMembers";
import EditItemNames from "../pages/item_names/EditItemNames";
import EditItems from "../pages/items/EditItems";
import CreateBuyCredits from "../pages/buy_merchants/CreateBuyCredits";
import DetailBuyMerchant from "../pages/buy_merchants/DetailBuyMerchant";
import CreateItemNames from "../pages/item_names/CreateItemNames";
import EditExpenseNames from "../pages/expense_names/EditExpenseNames";
import EditExpenses from "../pages/expenses/EditExpenses";
import DetailSale from "../pages/sales/DetailSale";
import CreateCreditSale from "../pages/sales/CreateCreditSale";
import BestItemReport from "../pages/report/BestItemReport";
import PurchaseReport from "../pages/report/PurchaseReport";
import ProfitReport from "../pages/report/ProfitReport";
import { Positions } from "../util/positions";

const { Header, Footer, Sider, Content } = Layout;

const text = (
  <Title level={4} style={{ textAlign: "center" }}>
    Profile
  </Title>
);

const Admin = ({ auth, error, logout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    error.message !== null && message.error(error.message);

    return () => error.message;
  }, [error.message]);

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  const content = (
    <Space direction="vertical" style={{ textAlign: "center", width: "100%" }}>
      <Title level={5}>
        {auth.user.name}({auth.user.position})
      </Title>
      <Text>{auth.user.shop?.name}</Text>
      <Button danger onClick={handleLogout}>
        Logout
      </Button>
    </Space>
  );

  let selectedKey;
  switch (pathname) {
    case "/admin/dashboard":
      selectedKey = "Dashboard";
      break;
    case "/admin/create-accounts":
      selectedKey = "CreateAccounts";
      break;
    case "/admin/show-accounts":
      selectedKey = "ShowAccounts";
      break;
    case "/admin/create-merchants":
      selectedKey = "CreateMerchants";
      break;
    case "/admin/show-merchants":
      selectedKey = "ShowMerchants";
      break;
    case "/admin/create-members":
      selectedKey = "CreateMembers";
      break;
    case "/admin/show-members":
      selectedKey = "ShowMembers";
      break;
    case "/admin/create-items":
      selectedKey = "CreateItems";
      break;
    case "/admin/show-item-names":
      selectedKey = "ShowItemNames";
      break;
    case "/admin/show-items":
      selectedKey = "ShowItems";
      break;
    case "/admin/create-buy-merchants":
      selectedKey = "CreateBuyMerchants";
      break;
    case "/admin/show-buy-merchants":
      selectedKey = "ShowBuyMerchants";
      break;
    case "/admin/create-expenses":
      selectedKey = "CreateExpenses";
      break;
    case "/admin/show-expenses":
      selectedKey = "ShowExpenses";
      break;
    case "/admin/create-expense-names":
      selectedKey = "CreateExpenseNames";
      break;
    case "/admin/show-expense-names":
      selectedKey = "ShowExpenseNames";
      break;
    case "/admin/create-shops":
      selectedKey = "CreateShops";
      break;
    case "/admin/show-shops":
      selectedKey = "ShowShops";
      break;
    case "/admin/create-buy-items":
      selectedKey = "CreateBuyItems";
      break;
    case "/admin/show-buy-items":
      selectedKey = "ShowBuyItems";
      break;
    case "/admin/show-stocks":
      selectedKey = "ShowStocks";
      break;
    case "/admin/create-item-transfers":
      selectedKey = "CreateItemTransfers";
      break;
    case "/admin/show-item-transfers":
      selectedKey = "ShowItemTransfers";
      break;
    case "/admin/show-owner-used-items":
      selectedKey = "ShowOwnerUsedItems";
      break;
    case "/admin/show-damage-items":
      selectedKey = "ShowDamageItems";
      break;
    case "/admin/invoice-report":
      selectedKey = "InvoiceReport";
      break;
    case "/admin/sale-item-report":
      selectedKey = "SaleItemReport";
      break;
    case "/admin/purchase-report":
      selectedKey = "PurchaseReport";
      break;
    case "/admin/profit-report":
      selectedKey = "ProfitReport";
      break;
    default:
      selectedKey = "Dashboard";
      break;
  }

  const { position } = auth.user;

  return (
    <Layout>
      <Header
        style={{ paddingTop: "13px", backgroundColor: "var(--white-color)" }}
      >
        <Button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            float: "left",
            backgroundColor: "var(--primary-color)",
            color: "var(--white-color)",
            marginRight: "3px",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
          )}
        </Button>
        <Popover
          placement="bottom"
          content={content}
          title={text}
          trigger="click"
        >
          <Avatar
            style={{ float: "right", backgroundColor: "var(--primary-color)" }}
            icon={<UserOutlined />}
            size="large"
          />
        </Popover>
        <Title style={{ color: "var(--primary-color)" }} level={3}>
          JOKER
        </Title>
      </Header>
      <Layout>
        <Sider
          collapsed={collapsed}
          style={{ backgroundColor: "var(--white-color)" }}
        >
          <Menu defaultSelectedKeys={[selectedKey]} mode="inline">
            <Menu.Item key="Dashboard" icon={<DashboardOutlined />}>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Menu.Item>
            {(position === Positions.MANAGER ||
              position === Positions.STAFF) && (
              <Menu.Item key="Sale" icon={<ShopOutlined />}>
                <Link to="/admin/create-sales">Sale</Link>
              </Menu.Item>
            )}
            {(position === Positions.MANAGER ||
              position === Positions.OWNER) && (
              <SubMenu
                key="Accounts"
                title="အကောင့်များ"
                icon={<FileImageOutlined />}
              >
                <Menu.Item key="ShowAccounts" icon={<UnorderedListOutlined />}>
                  <Link to="/admin/show-accounts">စာရင်း</Link>
                </Menu.Item>
                <Menu.Item key="CreateAccounts" icon={<SaveOutlined />}>
                  <Link to="/admin/create-accounts">အသစ်ဖန်တီးရန်</Link>
                </Menu.Item>
                <Menu.Item key="ShowShops" icon={<UnorderedListOutlined />}>
                  <Link to="/admin/show-shops">ဆိုင်များ</Link>
                </Menu.Item>
              </SubMenu>
            )}

            <SubMenu
              key="Merchants"
              title="ကုန်သည်များ"
              icon={<UsergroupAddOutlined />}
            >
              <Menu.Item key="ShowMerchants" icon={<UnorderedListOutlined />}>
                <Link to="/admin/show-merchants">စာရင်း</Link>
              </Menu.Item>
              <Menu.Item key="CreateMerchants" icon={<SaveOutlined />}>
                <Link to="/admin/create-merchants">အသစ်ဖန်တီးရန်</Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu
              key="Members"
              title="မန်ဘာများ"
              icon={<UsergroupAddOutlined />}
            >
              <Menu.Item key="ShowMembers" icon={<UnorderedListOutlined />}>
                <Link to="/admin/show-members">စာရင်း</Link>
              </Menu.Item>
              {(position === Positions.MANAGER ||
                position === Positions.STAFF) && (
                <Menu.Item key="CreateMembers" icon={<SaveOutlined />}>
                  <Link to="/admin/create-members">အသစ်ဖန်တီးရန်</Link>
                </Menu.Item>
              )}
            </SubMenu>
            <SubMenu
              key="Items"
              title="ပစ္စည်းများ"
              icon={<DatabaseOutlined />}
            >
              <Menu.Item key="ShowItemNames" icon={<UnorderedListOutlined />}>
                <Link to="/admin/show-item-names">ပစ္စည်းအမည်များစာရင်း</Link>
              </Menu.Item>
              <Menu.Item key="ShowItems" icon={<UnorderedListOutlined />}>
                <Link to="/admin/show-items">ပစ္စည်းများစာရင်း</Link>
              </Menu.Item>
              <Menu.Item key="ShowStocks" icon={<UnorderedListOutlined />}>
                <Link to="/admin/show-stocks">Stocksစာရင်း</Link>
              </Menu.Item>
              <Menu.Item
                key="ShowBuyMerchants"
                icon={<UnorderedListOutlined />}
              >
                <Link to="/admin/show-buy-merchants">ပစ္စည်းအဝယ်သွင်းရန်</Link>
              </Menu.Item>
              <Menu.Item
                key="ShowItemTransfers"
                icon={<UnorderedListOutlined />}
              >
                <Link to="/admin/show-item-transfers">
                  ပစ္စည်းလွှဲပြောင်းရန်
                </Link>
              </Menu.Item>
              <Menu.Item
                key="ShowOwnerUsedItems"
                icon={<UnorderedListOutlined />}
              >
                <Link to="/admin/show-owner-used-items">
                  ပစ္စည်းထုတ်သုံးခြင်း
                </Link>
              </Menu.Item>
              <Menu.Item key="ShowDamageItems" icon={<UnorderedListOutlined />}>
                <Link to="/admin/show-damage-items">
                  ချို့ယွင်းချက်ရှိပစ္စည်းများ
                </Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="Expenses"
              title="ကုန်ကျစရိတ်များ"
              icon={<CalculatorOutlined />}
            >
              <Menu.Item key="ShowExpenses" icon={<UnorderedListOutlined />}>
                <Link to="/admin/show-expenses">စာရင်း</Link>
              </Menu.Item>
              {(position === Positions.MANAGER ||
                position === Positions.STAFF) && (
                <Menu.Item key="CreateExpenses" icon={<SaveOutlined />}>
                  <Link to="/admin/create-expenses">အသစ်ဖန်တီးရန်</Link>
                </Menu.Item>
              )}
              <Menu.Item
                key="ShowExpenseNames"
                icon={<UnorderedListOutlined />}
              >
                <Link to="/admin/show-expense-names">ကုန်ကျစရိတ်အမည်များ</Link>
              </Menu.Item>
            </SubMenu>

            {/* <SubMenu
              key="BuyItems"
              title="အဝယ်ပစ္စည်းများ"
              icon={<UnorderedListOutlined />}
            >
              <Menu.Item key="ShowBuyItems" icon={<UnorderedListOutlined />}>
                <Link to="/admin/show-buy-items">စာရင်း</Link>
              </Menu.Item>
              <Menu.Item key="CreateBuyItems" icon={<SaveOutlined />}>
                <Link to="/admin/create-buy-items">အသစ်ဖန်တီးရန်</Link>
              </Menu.Item>
            </SubMenu> */}

            <SubMenu key="Report" title="Report" icon={<FileZipOutlined />}>
              <Menu.Item key="InvoiceReport" icon={<UnorderedListOutlined />}>
                <Link to="/admin/invoice-report">ဘောင်ချာအရောင်းမှတ်တမ်း</Link>
              </Menu.Item>
              {(position === Positions.MANAGER ||
                position === Positions.OWNER) && (
                <>
                  <Menu.Item
                    key="SaleItemReport"
                    icon={<UnorderedListOutlined />}
                  >
                    <Link to="/admin/sale-item-report">
                      ပစ္စည်းအရောင်းမှတ်တမ်း
                    </Link>
                  </Menu.Item>
                  <Menu.Item
                    key="PurchaseReport"
                    icon={<UnorderedListOutlined />}
                  >
                    <Link to="/admin/purchase-report">အဝယ်မှတ်တမ်း</Link>
                  </Menu.Item>
                  <Menu.Item
                    key="ProfitReport"
                    icon={<UnorderedListOutlined />}
                  >
                    <Link to="/admin/profit-report">Profit Report</Link>
                  </Menu.Item>
                </>
              )}
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ minHeight: "520px" }}>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="detail-sales/:id" element={<DetailSale />} />
              <Route
                path="create-sale-credits/:id"
                element={<CreateCreditSale />}
              />
              <Route path="create-accounts" element={<CreateAccounts />} />
              <Route path="show-accounts" element={<ShowAccounts />} />
              <Route path="create-merchants" element={<CreateMerchants />} />
              <Route path="show-merchants" element={<ShowMerchants />} />
              <Route path="edit-merchants/:id" element={<EditMerchants />} />
              <Route path="create-members" element={<CreateMembers />} />
              <Route path="show-members" element={<ShowMembers />} />
              <Route path="edit-members/:id" element={<EditMembers />} />
              <Route path="create-items" element={<CreateItems />} />
              <Route path="show-items" element={<ShowItems />} />
              <Route path="edit-items/:id" element={<EditItems />} />
              <Route path="create-item-names" element={<CreateItemNames />} />
              <Route path="show-item-names" element={<ShowItemNames />} />
              <Route path="edit-item-names/:id" element={<EditItemNames />} />
              <Route path="show-stocks" element={<ShowStocks />} />
              <Route
                path="create-buy-merchants"
                element={<CreateBuyMerchants />}
              />
              <Route path="show-buy-merchants" element={<ShowBuyMerchants />} />
              <Route
                path="detail-buy-merchants/:id"
                element={<DetailBuyMerchant />}
              />
              <Route
                path="create-buy-credits/:id"
                element={<CreateBuyCredits />}
              />
              <Route path="create-expenses" element={<CreateExpenses />} />
              <Route path="show-expenses" element={<ShowExpenses />} />
              <Route path="edit-expenses/:id" element={<EditExpenses />} />
              <Route
                path="create-expense-names"
                element={<CreateExpenseNames />}
              />
              <Route path="show-expense-names" element={<ShowExpenseNames />} />
              <Route
                path="edit-expense-names/:id"
                element={<EditExpenseNames />}
              />
              <Route path="create-shops" element={<CreateShops />} />
              <Route path="show-shops" element={<ShowShops />} />
              <Route path="edit-shops/:id" element={<EditShops />} />
              <Route path="create-buy-items" element={<CreateBuyItems />} />
              <Route path="show-buy-items" element={<ShowBuyItems />} />
              <Route
                path="create-item-transfers"
                element={<CreateItemTransfers />}
              />
              <Route
                path="show-item-transfers"
                element={<ShowItemTransfers />}
              />
              <Route
                path="show-owner-used-items"
                element={<ShowOwnerUsedItems />}
              />
              <Route
                path="create-owner-used-items"
                element={<CreateOwnerUsedItems />}
              />
              <Route path="show-damage-items" element={<ShowDamageItems />} />
              <Route
                path="create-damage-items"
                element={<CreateDamageItems />}
              />
              <Route path="invoice-report" element={<InvoiceReport />} />
              <Route path="sale-item-report" element={<SaleItemReport />} />
              <Route path="best-item-report" element={<BestItemReport />} />
              <Route path="purchase-report" element={<PurchaseReport />} />
              <Route path="profit-report" element={<ProfitReport />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
            </Routes>
          </Content>
          <Footer
            style={{
              backgroundColor: "var(--white-color)",
              textAlign: "center",
              fontWeight: "bold",
              color: "var(--primary-color)",
            }}
          >
            JOKER DEVELOP BY RCS
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = (store) => ({
  auth: store.auth,
  error: store.error,
});

export default connect(mapStateToProps, { logout })(Admin);
