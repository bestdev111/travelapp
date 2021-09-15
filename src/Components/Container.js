import React, { Component } from "react";
import LeftNavigationBar from "./LeftNavigationBar";
//Antd Design
import { Layout, Breadcrumb } from "antd";
//Components
import AddCountry from "./AddCountry";
import CountryList from "./CountryList";
import AddHotel from "./AddHotel";
import HotelList from "./HotelList";
import AddTag from "./AddTag";
import TagList from "./TagList";
import AddPackage from "./AddPackage";
import SalesTeamList from "./SalesTeamList";
import PackageList from "./PackageList";
import TripDetails from "./TripDetails";
import PackageHotel from "./PackageAddHotel";

const { Header, Content, Footer } = Layout;

class Container extends Component {
  constructor() {
    super();
  }

  state = {
    navigate: "Dashboard",
  };

  handleNavigate = (route) => {
    console.log(route);
    this.setState(
      {
        navigate: route,
      },
      () => {}
    );
  };

  renderContent = () => {
    if (this.state.navigate == "AddCountry")
      return <AddCountry handleNavigate={this.handleNavigate} />;
    else if (this.state.navigate == "CountryList") return <CountryList />;
    else if (this.state.navigate == "AddHotel") return <AddHotel />;
    else if (this.state.navigate == "HotelList") return <HotelList />;
    else if (this.state.navigate == "AddTag") return <AddTag />;
    else if (this.state.navigate == "TagList") return <TagList />;
    else if (this.state.navigate == "AddPackage") return <AddPackage />;
    else if (this.state.navigate == "SalesTeamList") return <SalesTeamList />;
    else if (this.state.navigate == "PackageList") return <PackageList />;
    else if (this.state.navigate == "TripDetails") return <TripDetails />;
    else if (this.state.navigate == "PackageHotel") return <PackageHotel />;
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <LeftNavigationBar handleNavigate={this.handleNavigate} />
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: "0 16px" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360, margin: 20 }}
            >
              {this.renderContent()}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Container;
