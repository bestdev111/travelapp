import React, { Component, useState } from "react";
import { Input, Button, Select, Upload, Checkbox } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { db, storage } from "../utils/firebase";

const { Option } = Select;
const fileList = [];

class AddPackage extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  state = {
    Name: "",
    Country: [],
    State: [],
    Hotel: [],
    Picture: [],
    Tag: [],
    selectedCountry: "",
    selectedState: "",
    File: [],
    FileName: [],
    TagList: [],
    HotelList: [],
  };

  generateUUID = () => {
    return "xxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    // alert(`Selected file - ${this.fileInput.current.files[0].name}`);
    console.log(this.fileInput.current.files);
    let name = [];
    for (let i = 0; i < this.fileInput.current.files.length; i++) {
      const uploadTask = storage
        .ref(`images/${this.fileInput.current.files[i].name}`)
        .put(this.fileInput.current.files[i]);
      name.push(this.fileInput.current.files[i].name);
      uploadTask.on("state_changed", (snapshot) => {});
    }
    this.setState({
      FileName: name,
    });

    let uuid = this.generateUUID();
    try {
      await db
        .collection("Package")
        .doc(uuid)
        .set({
          PackageID: uuid,
          Country: this.state.selectedCountry,
          DepartureCity: this.state.DepartureCity,
          Duration: this.state.Duration,
          EndCity: this.state.EndCity,
          Language: this.state.Language,
          Name: this.state.Name,
          PackageImage: name,
          PickupLocation: this.state.PickupLocation,
          PickupTime: this.state.PickupTime,
          State: this.state.selectedState,
          TourCode: this.state.TourCode,
          TourType: this.state.TourType,
        })
        .then(() => {
          alert("SUCCESSFULLY ADDED");
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

  handleCountry = (value) => {
    this.setState(
      {
        selectedCountry: value,
      },
      () => {
        console.log(this.state.selectedCountry);
        this.renderState(this.state.selectedCountry);
      }
    );
  };

  handleState = (value) => {
    this.setState(
      {
        selectedState: value,
      },
      () => {
        console.log(this.state.selectedState);
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
            mode="multiple"
            allowClear
            style={{ width: "80%" }}
            placeholder="Please select"
            onChange={this.handleState}
          >
            {State.map((item) => (
              <Option value={item}>{item}</Option>
            ))}
            {State}
          </Select>
        </>
      );
    }
  };

  renderTagList = (tag) => {
    if (tag == null) {
      console.log("Nothing inside");
    } else {
      return (
        <>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "80%" }}
            placeholder="Please select"
          >
            {tag.map((item) => (
              <Option value={item}>{item}</Option>
            ))}
            {tag}
          </Select>
        </>
      );
    }
  };

  renderHotelList = (Hotel) => {
    if (Hotel == null) {
      console.log("Nothing inside");
    } else {
      return (
        <>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "80%" }}
            placeholder="Please select"
          >
            {Hotel.map((item) => (
              <Option value={item}>{item}</Option>
            ))}
            {Hotel}
          </Select>
        </>
      );
    }
  };

  componentDidMount = async () => {
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

      db.collection("Tag")
        .get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          let TagList = [];
          data.map((Tag) => {
            TagList.push(Tag.TagName);
          });
          console.log(TagList);
          this.setState({ TagList: TagList });
        });

      db.collection("Hotel")
        .get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          let HotelList = [];
          data.map((Hotel) => {
            HotelList.push(Hotel.HotelName);
          });
          console.log(HotelList);
          this.setState({ HotelList: HotelList });
        });
    } catch (err) {
      console.log(err);
    }
  };

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
          name="Country"
          defaultValue="-Select One-"
        >
          {CountryList.map((country) => (
            <Option value={country.Name}>{country.Name}</Option>
          ))}
        </Select>
      </>
    );
  };

  render() {
    return (
      <>
        <h2>Add Package</h2>
        <br></br>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "33%" }}>
            <text>Package Name: &nbsp;&nbsp;&nbsp;</text>
            <Input
              placeholder="Name"
              style={{ width: 150 }}
              name="Name"
              value={this.state.Name}
              onChange={this.onChange}
            />
          </div>

          <div style={{ width: "33%" }}>
            <text>
              Country:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;
            </text>
            {this.renderCountryList(this.state.Country)}
          </div>

          <div style={{ width: "33%" }}>
            <text>
              State:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </text>
            {this.renderStateList(this.state.State)}
          </div>
        </div>

        <br />
        <br />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "33%" }}>
            <text>
              Tour Code:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </text>
            <Input
              placeholder="Tour Code"
              style={{ width: 150 }}
              name="TourCode"
              value={this.state.TourCode}
              onChange={this.onChange}
            />
          </div>

          <div style={{ width: "33%" }}>
            <text>Departure City: &nbsp;</text>
            <Input
              placeholder="Departure City"
              style={{ width: 150 }}
              name="DepartureCity"
              value={this.state.DepartureCity}
              onChange={this.onChange}
            />
          </div>

          <div style={{ width: "33%" }}>
            <text>End City: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</text>
            <Input
              placeholder="End City"
              style={{ width: 150 }}
              name="EndCity"
              value={this.state.EndCity}
              onChange={this.onChange}
            />
          </div>
        </div>

        <br />
        <br />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "33%" }}>
            <text>
              Duration:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;
            </text>
            <Input
              placeholder="Duration"
              style={{ width: 150 }}
              name="Duration"
              value={this.state.Duration}
              onChange={this.onChange}
            />
          </div>

          <div style={{ width: "33%" }}>
            <text>
              Tour Type: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </text>
            <Input
              placeholder="Tour Type"
              style={{ width: 150 }}
              name="TourType"
              value={this.state.TourType}
              onChange={this.onChange}
            />
          </div>

          <div style={{ width: "33%" }}>
            <text>Language: &nbsp;&nbsp;&nbsp;&nbsp;</text>
            <Input
              placeholder="Language"
              style={{ width: 150 }}
              name="Language"
              value={this.state.Language}
              onChange={this.onChange}
            />
          </div>
        </div>

        <br />
        <br />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "33%" }}>
            <text>Pickup Location: </text>
            <Input
              placeholder="Pickup Location"
              style={{ width: 150 }}
              name="PickupLocation"
              value={this.state.PickupLocation}
              onChange={this.onChange}
            />
          </div>

          <div style={{ width: "33%" }}>
            <text>Pickup Time: &nbsp;&nbsp;&nbsp;&nbsp;</text>
            <Input
              placeholder="Pickup Time"
              style={{ width: 150 }}
              name="PickupTime"
              value={this.state.PickupTime}
              onChange={this.onChange}
            />
          </div>

          <div style={{ width: "33%" }}>
            <text>
              Tag:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </text>
            {this.renderTagList(this.state.TagList)}
          </div>
        </div>

        <br />
        <br />

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "33%" }}>
            <text>
              Hotel:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </text>
            {this.renderHotelList(this.state.HotelList)}
          </div>

          <div style={{ width: "33%" }}>
            <text>Commission: &nbsp;&nbsp;&nbsp;&nbsp;</text>
            <Input
              placeholder="Supervisor"
              style={{ width: 150 }}
              name="SupervisorCommission"
              value={this.state.SupervisorCommission}
              onChange={this.onChange}
            />
          </div>

          <div style={{ width: "33%" }}>
            <text>Commission: &nbsp;&nbsp;&nbsp;&nbsp;</text>
            <Input
              placeholder="Sales Team"
              style={{ width: 150 }}
              name="SalesTeamCommission"
              value={this.state.SalesTeamCommission}
              onChange={this.onChange}
            />
          </div>
        </div>

        <br />
        <br />

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "33%" }}>
            <text>
              Price:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;
            </text>
            <Input
              placeholder="Adult Price"
              style={{ width: 150 }}
              name="PackagePrice"
              value={this.state.PackagePrice}
              onChange={this.onChange}
            />
            &nbsp;&nbsp;<Checkbox checked></Checkbox>
            <br />
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input
              placeholder="Child Price"
              style={{ width: 150 }}
              name="PackagePrice"
              value={this.state.PackagePrice}
              onChange={this.onChange}
            />
            &nbsp;&nbsp;<Checkbox checked></Checkbox>
            <br />
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input
              placeholder="Senior Citizen Price"
              style={{ width: 150 }}
              name="PackagePrice"
              value={this.state.PackagePrice}
              onChange={this.onChange}
              disabled
            />
            &nbsp;&nbsp;<Checkbox></Checkbox>
          </div>

          <div style={{ width: "33%" }}>
            <text>Package Image: </text>
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture"
              defaultFileList={[...fileList]}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </div>

          <div style={{ width: "33%" }}>
            <Button
              type="primary"
              onClick={this.handleSubmit}
              style={{ float: "right" }}
            >
              Add
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default AddPackage;
