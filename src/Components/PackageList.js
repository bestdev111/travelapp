import React, { Component } from "react";
import { Table, Tag, Button, Input, List, Select, Checkbox } from "antd";
import { db } from "../utils/firebase";
import { AudioOutlined } from "@ant-design/icons";
import mask from "../Image/Mask.png";

const { Search } = Input;
const { Option } = Select;

class SalesTeamList extends Component {
  state = {
    SalesTeam: [],
    SalesTeamID: "",
    PackageID: "",
    Country: [],
    State: [],
    selectedCountry: "",
  };
  componentDidMount() {
    this.getPackage();

    let country = [];
    try {
      db.collection("Country")
        .get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());

          data.map((Country) => {
            country.push({
              Id: Country.CountryID,
              Name: Country.CountryName,
              State: Country.State == null ? "" : Country.State,
            });
          });

          this.setState({ Country: country }, () => {});
        });
    } catch (err) {
      console.log(err);
    }
  }

  renderCountryList = (Country) => {
    let CountryList = [];
    Country.map((value) => {
      CountryList.push({
        Id: value.Id,
        Name: value.Name,
      });
    });

    return (
      <>
        <Select
          style={{ width: 120 }}
          onChange={this.handleCountry}
          defaultValue={this.state.selectedCountry}
        >
          {CountryList.map((country) => (
            <Option value={country.Name}>{country.Name}</Option>
          ))}
        </Select>
      </>
    );
  };

  handleCountry = (value) => {
    this.setState(
      {
        selectedCountry: value,
      },
      () => {
        this.renderState(this.state.selectedCountry);
      }
    );
  };

  renderState = async (countryID) => {
    const citiesRef = db.collection("Country");
    const snapshot = await citiesRef
      .where("CountryName", "==", countryID)
      .get();
    let stateList = [];
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    } else {
      snapshot.forEach((doc) => {
        doc.data().State.map((state) => {
          stateList.push(state);
        });
      });
      this.setState({ State: stateList }, () => {});
    }
  };

  renderStateList = (State) => {
    if (State == null) {
      console.log("Nothing inside");
    } else {
      return (
        <>
          <Select
            style={{ width: 120 }}
            onChange={this.handleState}
            defaultValue={this.state.selectedState}
          >
            {State.map((item) => (
              <Option value={item}>{item}</Option>
            ))}
          </Select>
        </>
      );
    }
  };

  getPackage = async () => {
    try {
      db.collection("Package")
        .get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          //console.log(data); // array
          this.handlePackageData(data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  handlePackageData = (Package) => {
    let data = [];
    let id = 1;
    Package.map((Package) => {
      data.push({
        Id: id,
        Name: Package.Name,
        Country: Package.Country,
        State: Package.State,
        DepartureCity: Package.DepartureCity,
        EndCity: Package.EndCity,
        Duration: Package.Duration,
        TourType: Package.TourType,
        TourCode: Package.TourCode,
        Language: Package.Language,
        PickupLocation: Package.PickupLocation,
        PickupTime: Package.PickupTime,
        PackageID: Package,
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

  handlePackageDetails = (id) => {
    console.log(id);
    this.setState(
      {
        PackageID: id.PackageID,
        selectedCountry: id.Country,
        DepartureCity: id.DepartureCity,
        Duration: id.Duration,
        EndCity: id.EndCity,
        Language: id.Language,
        Name: id.Name,
        PickupLocation: id.PickupLocation,
        PickupTime: id.PickupTime,
        selectedState: id.State,
        TourCode: id.TourCode,
        TourType: id.TourType,
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
        this.getPackage();
      }
    );
  };

  handleUpdate = async (e) => {
    console.log(this.state);
    try {
      await db
        .collection("Package")
        .doc(this.state.PackageID)
        .update({
          Country: this.state.selectedCountry,
          DepartureCity: this.state.DepartureCity,
          Duration: this.state.Duration,
          EndCity: this.state.EndCity,
          Language: this.state.Language,
          Name: this.state.Name,
          PickupLocation: this.state.PickupLocation,
          PickupTime: this.state.PickupTime,
          State: this.state.selectedState,
          TourCode: this.state.TourCode,
          TourType: this.state.TourType,
        })
        .then(() => {
          alert("UPDATE ADDED");
        });
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
        fixed: "left",
      },
      {
        title: "Name",
        dataIndex: "Name",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
        width: "200px",
        fixed: "left",
      },
      {
        title: "Country",
        dataIndex: "Country",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
      },
      {
        title: "State",
        dataIndex: "State",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
        ellipsis: true,
      },
      {
        title: "Tour Code",
        dataIndex: "TourCode",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
        ellipsis: true,
      },
      {
        title: "Departure City",
        dataIndex: "DepartureCity",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
        ellipsis: true,
        width: "120px",
      },
      {
        title: "End City",
        dataIndex: "EndCity",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
        ellipsis: true,
      },
      {
        title: "Duration",
        dataIndex: "Duration",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
        ellipsis: true,
      },
      {
        title: "Tour Type",
        dataIndex: "TourType",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
        ellipsis: true,
      },
      {
        title: "Language",
        dataIndex: "Language",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
        ellipsis: true,
      },
      {
        title: "Pickup Location",
        dataIndex: "PickupLocation",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
        ellipsis: true,
      },
      {
        title: "Pickup Time",
        dataIndex: "PickupTime",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
        ellipsis: true,
      },
      {
        title: "Details",
        dataIndex: "PackageID",
        render: (PackageID) => {
          return (
            <Button
              type="primary"
              onClick={this.handlePackageDetails.bind(this, PackageID)}
            >
              Details
            </Button>
          );
        },
        ellipsis: true,
        width: "100px",
        fixed: "right",
      },
      {
        title: "Delete",
        dataIndex: "PackageID",
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
        fixed: "right",
      },
    ];

    return (
      <>
        {this.state.PackageID.length == 0 ? (
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
            <Table
              columns={column}
              dataSource={this.state.SalesTeam}
              scroll={{ x: 1300 }}
            />
          </>
        ) : (
          <>
            <h2>Package Details</h2>
            <text style={{ padding: "auto" }}>Name: &nbsp;</text>
            <br />
            <Input
              placeholder="Name"
              name="Name"
              value={this.state.Name}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <text>
              Country:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;
            </text>
            {this.renderCountryList(this.state.Country)}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;
            <text>
              State:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </text>
            {this.renderStateList(this.state.State)}
            <br />
            <br />
            <text style={{ padding: "auto" }}>Tour Code : &nbsp;</text>
            <br />
            <Input
              placeholder="Tour Code"
              name="TourCode"
              value={this.state.TourCode}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <text style={{ padding: "auto" }}>Departure City: &nbsp;</text>
            <br />
            <Input
              placeholder="Departure City"
              name="DepartureCity"
              value={this.state.DepartureCity}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <text style={{ padding: "auto" }}>End City: &nbsp;</text>
            <br />
            <Input
              placeholder="End City"
              name="EndCity"
              value={this.state.EndCity}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <text style={{ padding: "auto" }}>Duration: &nbsp;</text>
            <br />
            <Input
              placeholder="Duration"
              name="Duration"
              value={this.state.Duration}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <text style={{ padding: "auto" }}>Tour Type: &nbsp;</text>
            <br />
            <Input
              placeholder="Tour Type"
              name="TourType"
              value={this.state.TourType}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <text style={{ padding: "auto" }}>Language: &nbsp;</text>
            <br />
            <Input
              placeholder="Language"
              name="Language"
              value={this.state.Language}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <text style={{ padding: "auto" }}>Pickup Location: &nbsp;</text>
            <br />
            <Input
              placeholder="Pickup Location"
              name="PickupLocation"
              value={this.state.PickupLocation}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <text style={{ padding: "auto" }}>Pickup Time: &nbsp;</text>
            <br />
            <Input
              placeholder="Pickup Time"
              name="PickupTime"
              value={this.state.PickupTime}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <div>
              Select cover photo:
              <br />
              <br />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  textAlign: "center",
                }}
              >
                <div>
                  <img src={mask} style={{ width: 120 }}></img>
                  <br />
                  <Checkbox></Checkbox>
                </div>
                &nbsp;&nbsp;
                <div>
                  <img src={mask} style={{ width: 120 }}></img>
                  <br />
                  <Checkbox></Checkbox>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Button type="primary" onClick={this.handleUpdate}>
                  Edit
                </Button>
                <text>&nbsp;&nbsp;&nbsp;&nbsp;</text>
                <Button type="primary" onClick={this.handleBack}>
                  Back
                </Button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

export default SalesTeamList;
