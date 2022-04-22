import React, { useEffect } from "react";
import {
  Typography,
  Space,
  Row,
  Col,
  Button,
  Table,
  message,
  Popconfirm,
  Spin,
} from "antd";
import Layout from "antd/lib/layout/layout";
import { PlusSquareOutlined, ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { getMembers, deleteMember } from "../../store/actions";
import { successDeleteMessage } from "../../util/messages";
import { Positions } from "../../util/positions";

const { Title } = Typography;

const ShowMembers = ({
  status,
  error,
  auth,
  member,
  getMembers,
  deleteMember,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    getMembers();

    return () => getMembers();
  }, [getMembers]);

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
    await deleteMember(id);
  };

  const { position } = auth.user;

  let columns = [];

  if (position === Positions.MANAGER || position === Positions.STAFF) {
    columns = [
      {
        title: "မန်ဘာကုတ်",
        dataIndex: "code",
      },
      {
        title: "အမည်",
        dataIndex: "name",
      },
      {
        title: "ဖုန်းနံပါတ်",
        dataIndex: "phone",
      },
      {
        title: "နေရပ်လိပ်စာ",
        dataIndex: "address",
      },
      // {
      //   title: "point စုစုပေါင်း",
      //   dataIndex: "points",
      // },
      {
        title: "Actions",
        dataIndex: "id",
        render: (id) => (
          <Space direction="horizontal">
            <Button
              type="primary"
              onClick={() => navigate(`/admin/edit-members/${id}`)}
            >
              Edit
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
        title: "မန်ဘာကုတ်",
        dataIndex: "code",
      },
      {
        title: "အမည်",
        dataIndex: "name",
      },
      {
        title: "ဖုန်းနံပါတ်",
        dataIndex: "phone",
      },
      {
        title: "နေရပ်လိပ်စာ",
        dataIndex: "address",
      },
      // {
      //   title: "point စုစုပေါင်း",
      //   dataIndex: "points",
      // },
    ];
  }

  return (
    <Spin spinning={status.loading}>
      <Layout style={{ margin: "20px" }}>
        <Space direction="vertical" size="middle">
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 18 }}>
              <Title level={3}>မန်ဘာစာရင်း</Title>
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
                  onClick={() => navigate("/admin/create-members")}
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
          <Table
            bordered
            columns={columns}
            dataSource={member.members}
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
  member: store.member,
});

export default connect(mapStateToProps, { getMembers, deleteMember })(
  ShowMembers
);
