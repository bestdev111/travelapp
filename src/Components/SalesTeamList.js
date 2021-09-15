import React, { Component } from "react";
import { Table, Tag, Button, Input, List } from "antd";
import { db } from "../utils/firebase";
import { AudioOutlined } from "@ant-design/icons";

const { Search } = Input;

class SalesTeamList extends Component {
  state = {
    SalesTeam: [],
    SalesTeamID: "",
  };
  componentDidMount() {
    this.getCountry();
  }

  getCountry = async () => {
    try {
      db.collection("SalesTeam")
        .get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          //console.log(data); // array
          this.handleSalesTeamData(data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  handleSalesTeamData = (SalesTeam) => {
    let data = [];
    let id = 1;
    SalesTeam.map((salesTeam) => {
      data.push({
        Id: id,
        Name: salesTeam.Name,
        PhoneNumber: salesTeam.PhoneNumber,
        SalesTeamID: salesTeam,
        Email: salesTeam.Email,
        Commission: salesTeam.Commission,
        Role: "Sales Team",
      });
      id++;
    });

    this.setState(
      {
        SalesTeam: data,
      },
      () => {}
    );
  };

  handleSalesTeamDetails = (id) => {
    this.setState(
      {
        SalesTeamID: id,
      },
      () => {}
    );
  };

  handleDelete = async (StateName) => {
    try {
      const stateRef = db
        .collection("Country")
        .doc(this.state.selectedCountryID.CountryID);
      let currentUserData = await stateRef.get();
      if (currentUserData.exists) {
        let State = currentUserData.data().State;
        let currentIndex = State.indexOf(StateName);
        if (currentIndex > -1) State.splice(currentIndex, 1);
        await stateRef.update({
          State: State,
        });

        this.setState(
          {
            selectedCountryID: "",
          },
          () => {
            this.getCountry();
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleDeleteState = async (country) => {
    try {
      const stateRef = db
        .collection("SalesTeam")
        .doc(country.CountryID)
        .delete();

      this.setState(
        {
          SalesTeamID: "",
        },
        () => {
          this.getCountry();
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  handleBack = (e) => {
    this.setState(
      {
        SalesTeamID: "",
      },
      () => {
        this.getCountry();
      }
    );
  };

  handleUpdate = async (e) => {
    try {
      const stateRef = db
        .collection("Country")
        .doc(this.state.selectedCountryID.CountryID);
      let currentUserData = await stateRef.get();
      if (currentUserData.exists) {
        let State = currentUserData.data().State;
        State.push(this.state.State);
        await stateRef.update({
          State: State,
        });

        this.setState(
          {
            selectedCountryID: "",
            State: "",
          },
          () => {
            this.getCountry();
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  renderList = (State) => {
    let list = [];
    State.map((value) => {
      list.push({
        Name: value,
      });
    });
    return (
      <List
        itemLayout="horizontal"
        dataSource={State}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item} />
            <Button type="primary" onClick={this.handleDelete.bind(this, item)}>
              Delete
            </Button>
          </List.Item>
        )}
      />
    );
  };

  render() {
    const column = [
      {
        title: "No",
        dataIndex: "Id",
        sorter: true,
        width: "45px",
        sorter: {
          compare: (a, b) => a.Id - b.Id,
          multiple: 2,
        },
        sortDirections: ["descend"],
      },
      {
        title: "Name",
        dataIndex: "Name",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
      },
      {
        title: "Phone Number",
        dataIndex: "PhoneNumber",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
      },
      {
        title: "Email",
        dataIndex: "Email",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
        ellipsis: true,
      },
      {
        title: "Commission",
        dataIndex: "Commission",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
        ellipsis: true,
      },
      {
        title: "Role",
        dataIndex: "Role",
      },
      {
        title: "Details",
        dataIndex: "SalesTeamID",
        render: (CountryID) => {
          return (
            <Button
              type="primary"
              onClick={this.handleSalesTeamDetails.bind(this, CountryID)}
            >
              Details
            </Button>
          );
        },
        ellipsis: true,
      },
      {
        title: "Delete",
        dataIndex: "SalesTeamID",
        render: (CountryID) => {
          return (
            <Button
              type="primary"
              onClick={this.handleDeleteState.bind(this, CountryID)}
            >
              Delete
            </Button>
          );
        },
        ellipsis: true,
      },
    ];

    return (
      <>
        {this.state.SalesTeamID.length == 0 ? (
          <>
            <div
              style={{
                width: "25%",
                display: "flex",
                flexDirection: "row",
                textAlign: "right",
              }}
            >
              <Search placeholder="input search text" enterButton />
            </div>
            <Table columns={column} dataSource={this.state.SalesTeam} />
          </>
        ) : (
          <>
            <h2>Sales Team Details</h2>
            <text style={{ padding: "auto" }}>Name: &nbsp;</text>
            <br />
            <Input
              placeholder="Name"
              name="Name"
              value={this.state.SalesTeamID.Name}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <text style={{ padding: "auto" }}>Phone Number: &nbsp;</text>
            <br />
            <Input
              placeholder="Phone Number"
              name="PhoneNumber"
              value={this.state.SalesTeamID.PhoneNumber}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <text style={{ padding: "auto" }}>Email: &nbsp;</text>
            <br />
            <Input
              placeholder="Email"
              name="Email"
              value={this.state.SalesTeamID.Email}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Button type="primary" onClick={this.handleUpdate}>
                Edit
              </Button>
              <text>&nbsp;&nbsp;&nbsp;&nbsp;</text>
              <Button type="primary" onClick={this.handleBack}>
                Back
              </Button>
            </div>
          </>
        )}
      </>
    );
  }
}

export default SalesTeamList;
