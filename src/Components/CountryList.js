import React, { Component } from "react";
import { Table, Tag, Button, Input, List } from "antd";
import { db } from "../utils/firebase";

class CountryList extends Component {
  state = {
    Country: [],
    State: "",
    selectedCountryID: "",
  };
  componentDidMount() {
    this.getCountry();
  }

  getCountry = async () => {
    try {
      db.collection("Country")
        .get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          //console.log(data); // array
          this.handleCountryData(data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  handleCountryData = (Country) => {
    let data = [];
    let id = 1;
    Country.map((country) => {
      data.push({
        Id: id,
        Name: country.CountryName,
        State: country.State == null ? "" : country.State,
        CountryID: country,
      });
      id++;
    });

    this.setState(
      {
        Country: data,
      },
      () => {}
    );
  };

  handleAddState = (id) => {
    this.setState(
      {
        selectedCountryID: id,
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
      const stateRef = db.collection("Country").doc(country.CountryID).delete();

      this.setState(
        {
          selectedCountryID: "",
        },
        () => {
          this.getCountry();
        }
      );
    } catch (err) {
      console.log(err);
    }
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
        title: "State",
        dataIndex: "State",
        render: (State) => (
          <>
            {State.map((State) => {
              let color = "geekblue";
              return <Tag color={color}>{State.toUpperCase()}</Tag>;
            })}
          </>
        ),
      },
      {
        title: "Details",
        dataIndex: "CountryID",
        render: (CountryID) => {
          return (
            <Button
              type="primary"
              onClick={this.handleAddState.bind(this, CountryID)}
            >
              Details
            </Button>
          );
        },
        ellipsis: true,
      },
      {
        title: "Delete",
        dataIndex: "CountryID",
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
        {this.state.selectedCountryID.length == 0 ? (
          <Table columns={column} dataSource={this.state.Country} />
        ) : (
          <>
            <h2>Add State</h2>
            <text>
              Country Name: {this.state.selectedCountryID.CountryName}
            </text>
            <br></br>

            {this.renderList(this.state.selectedCountryID.State)}

            <Input
              placeholder="State"
              style={{ width: 150 }}
              name="State"
              value={this.state.State}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <Button type="primary" onClick={this.handleUpdate}>
              Add State
            </Button>
          </>
        )}
      </>
    );
  }
}

export default CountryList;
