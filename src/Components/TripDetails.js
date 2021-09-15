import React, { Component } from "react";
import { Table, Tag, Button, Input, List } from "antd";
import { db } from "../utils/firebase";

class TripDetails extends Component {
  state = {
    PackageID: "",
    rows: [{}],
  };

  componentDidMount() {
    this.getPackage();
  }
  handleChange = (idx) => (e) => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    rows[idx][name] = value;
    this.setState({
      rows,
    });
  };
  handleAddRow = () => {
    const item = {
      destination: "",
      description: "",
    };
    this.setState({
      rows: [...this.state.rows, item],
    });
  };
  handleSubmit = async () => {
    console.log(this.state.rows);
    try {
      await db
        .collection("Package")
        .doc(this.state.PackageID)
        .update({
          TripDetails: this.state.rows,
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
  handleRemoveRow = () => {
    this.setState({
      rows: this.state.rows.slice(0, -1),
    });
  };
  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
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
              Add Trip Details
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
            <h2>Add Trip Details</h2>
            <br></br>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ width: "33%" }}>
                <text>Package Name: {this.state.Name}</text>
              </div>
            </div>
            <br />
            <br />
            <table style={{ border: "1px solid #DDD" }}>
              <tr style={{ border: "1px solid #DDD" }}>
                <td style={{ border: "1px solid #DDD" }}>Day</td>
                <td style={{ border: "1px solid #DDD" }}>Destination</td>
                <td style={{ border: "1px solid #DDD" }}>Description</td>
                <td style={{ border: "1px solid #DDD" }}></td>
              </tr>
              {this.state.rows.map((item, idx) => (
                <tr id="addr0" key={idx + 1}>
                  <td style={{ border: "1px solid #DDD" }}>{idx + 1}</td>
                  <td style={{ border: "1px solid #DDD" }}>
                    <input
                      type="text"
                      name="destination"
                      value={this.state.rows[idx].destination}
                      onChange={this.handleChange(idx)}
                      className="form-control"
                    />
                  </td>
                  <td style={{ border: "1px solid #DDD" }}>
                    <input
                      type="text"
                      name="description"
                      value={this.state.rows[idx].description}
                      onChange={this.handleChange(idx)}
                      className="form-control"
                    />
                  </td>
                  <td style={{ border: "1px solid #DDD" }}>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={this.handleRemoveSpecificRow(idx)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </table>
            <br></br>
            <Button onClick={this.handleAddRow} type="primary">
              Add Row
            </Button>
            <Button onClick={this.handleRemoveRow}>Delete Last Row</Button>

            <br />
            <br />
            <br />
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

export default TripDetails;
