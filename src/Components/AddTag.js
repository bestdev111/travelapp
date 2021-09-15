import React, { Component } from "react";
import { Input, Radio, Button } from "antd";
import { db } from "../utils/firebase";

class AddTag extends Component {
  state = {
    TagName: "",
    SelectedTag: "",
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

  handleClick = async (e) => {
    let uuid = this.generateUUID();
    console.log(uuid);
    try {
      const Hotel = await db.collection("Tag").doc(uuid).set({
        TagName: this.state.TagName,
        TagID: uuid,
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <>
        <h2>Add New Tag</h2>
        <br></br>
        <Input
          placeholder="Tag Name"
          name="TagName"
          value={this.state.TagName}
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

export default AddTag;
