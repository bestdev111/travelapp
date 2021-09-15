import React, { Component } from "react";
import { Layout, Menu, Avatar } from "antd";
import {
  FolderOpenOutlined,
  UserOutlined,
  TagsOutlined,
  DatabaseOutlined,
  PoweroffOutlined,
  UserAddOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { SubMenu } = Menu;

class LeftNavigationBar extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        <div style={{ marginLeft: 5, paddingLeft: 5 }}>
          <Avatar size={64} icon={<UserOutlined />} gap={50} />
          <text style={{ color: "#fff", margin: 10 }}>Username</text>
        </div>
        <Menu theme="dark" defaultSelectedKeys={["3"]} mode="inline">
          <SubMenu key="sub1" icon={<UserAddOutlined />} title="Sales Team">
            <Menu.Item key="1">Add Sales Team</Menu.Item>
            <Menu.Item
              key="2"
              onClick={this.props.handleNavigate.bind(this, "SalesTeamList")}
            >
              Sales Team List
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<FolderOpenOutlined />} title="Package">
            <Menu.Item
              key="3"
              onClick={this.props.handleNavigate.bind(this, "AddPackage")}
            >
              Add Package
            </Menu.Item>
            <Menu.Item
              key="4"
              onClick={this.props.handleNavigate.bind(this, "PackageList")}
            >
              Package List
            </Menu.Item>
            <Menu.Item
              key="12"
              onClick={this.props.handleNavigate.bind(this, "TripDetails")}
            >
              Add Trip Details
            </Menu.Item>
            <Menu.Item
              key="13"
              onClick={this.props.handleNavigate.bind(this, "PackageHotel")}
            >
              Add Hotel To Package
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<DatabaseOutlined />} title="Hotel">
            <Menu.Item
              key="5"
              onClick={this.props.handleNavigate.bind(this, "AddHotel")}
            >
              Add Hotel
            </Menu.Item>
            <Menu.Item
              key="6"
              onClick={this.props.handleNavigate.bind(this, "HotelList")}
            >
              Hotel List
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub4" icon={<GlobalOutlined />} title="Country">
            <Menu.Item
              key="7"
              onClick={this.props.handleNavigate.bind(this, "AddCountry")}
            >
              Add Country
            </Menu.Item>
            <Menu.Item
              key="8"
              onClick={this.props.handleNavigate.bind(this, "CountryList")}
            >
              Country List
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub5" icon={<TagsOutlined />} title="Tag">
            <Menu.Item
              key="9"
              onClick={this.props.handleNavigate.bind(this, "AddTag")}
            >
              Add Tag
            </Menu.Item>
            <Menu.Item
              key="10"
              onClick={this.props.handleNavigate.bind(this, "TagList")}
            >
              Tag List
            </Menu.Item>
          </SubMenu>

          <Menu.Item
            key="11"
            icon={<PoweroffOutlined />}
            onClick={this.handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default LeftNavigationBar;
