import React, { Component } from "react";
import { Table, Tag, Button, Input, Checkbox } from "antd";
import { db } from "../utils/firebase";

const CheckboxGroup = Checkbox.Group;

class PackageAddHotel extends Component {
  state = {
    PackageID: "",
    hotel: [],
  };

  componentDidMount() {
    this.getPackage();
    this.getHotel();
  }

  handleSubmit = async () => {
    try {
      await db
        .collection("Package")
        .doc(this.state.PackageID)
        .update({
          Hotel: this.state.selectedHotel,
        })
        .then(() => {
          this.setState({
            PackageID: "",
          });
          alert(" ADDED");
        });
    } catch (err) {
      console.log(err);
    }
  };

  onChange = (e) => {
    this.setState({
      selectedHotel: e,
    });
  };

  handlePackageDetails = (id) => {
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
        selectedHotel: id.Hotel,
      },
      () => {}
    );
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

  getHotel = async () => {
    try {
      db.collection("Hotel")
        .get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data().HotelName);
          //console.log(data); // array
          this.setState(
            {
              hotel: data,
            },
            () => {
              console.log(this.state.hotel);
            }
          );
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
        title: "Details",
        dataIndex: "PackageID",
        render: (PackageID) => {
          return (
            <Button
              type="primary"
              onClick={this.handlePackageDetails.bind(this, PackageID)}
            >
              Add Hotel
            </Button>
          );
        },
        ellipsis: true,
        width: "100px",
        fixed: "right",
      },
    ];
    return (
      <>
        {this.state.PackageID.length != 0 ? (
          <>
            <h2>Add Hotel</h2>
            <br></br>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ width: "33%" }}>
                <text>Package Name: {this.state.Name}</text>
              </div>
            </div>

            <br />
            <br />
            <CheckboxGroup
              options={this.state.hotel}
              value={this.state.selectedHotel}
              onChange={this.onChange}
              width="100px"
            />

            <br />
            <br />
            <Button type="primary" onClick={this.handleSubmit}>
              Add
            </Button>
          </>
        ) : (
          <Table columns={column} dataSource={this.state.SalesTeam} />
        )}
      </>
    );
  }
}

export default PackageAddHotel;
