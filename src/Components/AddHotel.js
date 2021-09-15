import React, { Component } from "react";
import { Input, Radio, Button } from "antd";
import { db } from "../utils/firebase";

class AddHotel extends Component {
  state = {
    HotelName: "",
    HotelType: "",
    HotelPhone: "",
    HotelAddress: "",
  };

  generateUUID = () => {
    return "xxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onChange1 = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => {}
    );

    console.log(this.state.Breakfast);
  };

  handleClick = async (e) => {
    let uuid = this.generateUUID();
    console.log(uuid);
    try {
      const Hotel = await db.collection("Hotel").doc(uuid).set({
        HotelName: this.state.HotelName,
        HotelType: this.state.HotelType,
        HotelAddress: this.state.HotelAddress,
        HotelPhone: this.state.HotelPhone,
        HotelID: uuid,
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <>
        <h2>Add New Hotel</h2>
        <br></br>
        <Input
          placeholder="Hotel Name"
          name="HotelName"
          value={this.state.HotelName}
          onChange={this.onChange}
        />
        <br></br>
        <br></br>
        <Input
          placeholder="Hotel Type"
          name="HotelType"
          value={this.state.HotelType}
          onChange={this.onChange}
        />
        <br></br>
        <br></br>
        <Input
          placeholder="Hotel Address"
          name="HotelAddress"
          value={this.state.HotelAddress}
          onChange={this.onChange}
        />
        <br></br>
        <br></br>
        <Input
          placeholder="Hotel Phone"
          name="HotelPhone"
          value={this.state.HotelPhone}
          onChange={this.onChange}
        />
        <br></br>
        <br></br>
        <Button type="primary" onClick={this.handleClick}>
          Add
        </Button>
      </>
    );
  }
}

export default AddHotel;
