import React, { Component } from "react";
import { Input, Button } from "antd";
import { db } from "../utils/firebase";

class AddCountry extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    country: "",
    state: "",
  };

  generateUUID = () => {
    return "xxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  handleUpdate = async (e) => {
    try {
      const userRef = db.collection("CountryName");
      const stateRef = await userRef.where("CountryName", "==", "Malaysia");
      let currentUserData = await stateRef.get();
      if (currentUserData.exists) {
        let State = currentUserData.data().State;
        State.push("Perlis");
        await userRef.update({
          State: State,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleClick = async (e) => {
    let uuid = this.generateUUID();
    console.log(uuid);
    try {
      const countryRef = await db.collection("Country").doc(uuid).set({
        CountryName: this.state.country,
        CountryID: uuid,
        State: [],
      });
    } catch (err) {
      console.log(err);
    }
    this.props.handleNavigate("CountryList");
  };

  componentDidMount = async () => {
    try {
      db.collection("Country")
        .get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          console.log(data); // array of cities objects
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

  render() {
    return (
      <>
        <h2>Add New Country</h2>
        <br></br>
        <Input
          placeholder="Country"
          style={{ width: 150 }}
          name="country"
          value={this.state.country}
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

export default AddCountry;
