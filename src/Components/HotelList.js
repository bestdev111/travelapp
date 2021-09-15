import React, { Component } from "react";
import { Table, Tag, Button, Input, List, Radio } from "antd";
import { db } from "../utils/firebase";

class HotelList extends Component {
  state = {
    Hotel: [],
    SelectedHotel: "",
    SingleRoomPrice: 0,
    DoubleRoomPrice: 0,
    ChildWBedPrice: 0,
    ChildWNoBedPrice: 0,
    ExtendSingleRoomPrice: 0,
    ExtendDoubleRoomPrice: 0,
    ExtendChildWBedPrice: 0,
    ExtendChildWNoBedPrice: 0,
    HotelRoom: "",
    Room: [],
    getHotelList: [],
    getHotelRoomList: [],
    Breakfast: "",
    BreakfastPrice: "",
    Description: "",
  };

  componentDidMount() {
    this.getHotel();
    this.getHotelRoom();
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  getHotel = async () => {
    try {
      db.collection("Hotel")
        .get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          //console.log(data); // array
          this.setState(
            {
              getHotelList: data,
            },
            () => {}
          );
        });
    } catch (err) {
      console.log(err);
    }
  };

  getHotelRoom = async () => {
    try {
      db.collection("HotelRoom")
        .get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          this.setState(
            {
              getHotelRoomList: data,
            },
            () => {
              this.handleHotelData();
            }
          );
        });
    } catch (err) {
      console.log(err);
    }
  };

  handleDelete = async (room) => {
    try {
      const roomRef = db.collection("HotelRoom").doc(room.RoomID).delete();

      this.setState(
        {
          SelectedHotel: "",
        },
        () => {
          this.getHotel();
          this.getHotelRoom();
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  handleHotelData = () => {
    let data = [];
    let id = 1;

    console.log(this.state.getHotelList, this.state.getHotelRoomList);

    this.state.getHotelList.map((Hotel) => {
      let roomList = [];
      this.state.getHotelRoomList.map((Room) => {
        if (Hotel.HotelName == Room.HotelName) {
          roomList.push(Room.Room);
        }
      });
      data.push({
        Id: id,
        Name: Hotel.HotelName,
        Type: Hotel.HotelType,
        Phone: Hotel.HotelPhone,
        Address: Hotel.HotelAddress,
        SelectedHotel: Hotel,
        Room: roomList,
        Breakfast: this.convertBreakfast(Hotel.Breakfast),
      });
      id++;
    });

    this.setState(
      {
        Hotel: data,
      },
      () => {}
    );
  };

  handleAddRoom = (selectedHotel) => {
    this.setState({ SelectedHotel: selectedHotel }, () => {});
  };

  convertBreakfast(Breakfast) {
    if (Breakfast == true) {
      return "Provided";
    } else {
      return "Not Provided";
    }
  }

  renderRoomList = (HotelName) => {
    let roomList = [];
    console.log(HotelName);
    this.state.getHotelRoomList.map((Room) => {
      if (Room.HotelName == HotelName) {
        roomList.push(Room);
      }
    });

    return (
      <List
        itemLayout="horizontal"
        dataSource={roomList}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.Room}
              description={`RM ${
                item.Price
              } || Breakfast ${this.convertBreakfast(item.Breakfast)}
              || Description: ${item.Description}`}
            />
            {
              <Button
                type="primary"
                onClick={this.handleDelete.bind(this, item)}
              >
                Delete
              </Button>
            }
          </List.Item>
        )}
      />
    );
  };

  generateUUID = () => {
    return "xxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  handleUpdate = async (e) => {
    let uuid = this.generateUUID();
    try {
      const Hotel = await db.collection("HotelRoom").doc(uuid).set({
        HotelName: this.state.SelectedHotel.HotelName,
        Price: this.state.Price,
        Room: this.state.HotelRoom,
        RoomID: uuid,
        Breakfast: this.state.Breakfast,
        Description: this.state.Description,
      });

      this.setState(
        {
          SelectedHotel: "",
        },
        () => {
          this.getHotel();
          this.getHotelRoom();
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  handleDeleteHotel = async (hotel) => {
    try {
      const stateRef = db.collection("Hotel").doc(hotel.HotelID).delete();

      this.setState(
        {
          selectedHotel: "",
        },
        () => {
          this.getHotel();
          this.getHotelRoom();
        }
      );
    } catch (err) {
      console.log(err);
    }
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
        title: "Type",
        dataIndex: "Type",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
      },
      {
        title: "Phone",
        dataIndex: "Phone",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
      },
      {
        title: "Address",
        dataIndex: "Address",
        sorter: true,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        ellipsis: true,
        sortDirections: ["descend"],
      },
      {
        title: "Room",
        dataIndex: "Room",
        render: (Room) => (
          <>
            {Room.map((room) => {
              let color = "geekblue";
              return <Tag color={color}>{room.toUpperCase()}</Tag>;
            })}
          </>
        ),
      },
      {
        title: "Details",
        dataIndex: "SelectedHotel",
        render: (SelectedHotel) => {
          return (
            <Button
              type="primary"
              onClick={this.handleAddRoom.bind(this, SelectedHotel)}
            >
              Details
            </Button>
          );
        },
      },
      {
        title: "Delete",
        dataIndex: "SelectedHotel",
        render: (SelectedHotel) => {
          return (
            <Button
              type="primary"
              onClick={this.handleDeleteHotel.bind(this, SelectedHotel)}
            >
              Delete
            </Button>
          );
        },
      },
    ];

    return (
      <>
        {this.state.SelectedHotel.length == 0 ? (
          <Table columns={column} dataSource={this.state.Hotel} />
        ) : (
          <>
            <h2>Add Room</h2>
            <text>Hotel Name: {this.state.SelectedHotel.HotelName}</text>
            <br></br>
            <br></br>
            {this.renderRoomList(this.state.SelectedHotel.HotelName)}
            <br></br>
            <br></br>
            <text>Room Type: </text>
            <Input
              placeholder="Room Type"
              style={{ width: 150 }}
              name="HotelRoom"
              value={this.state.HotelRoom}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <text>Single Room Price: </text>
            <Input
              placeholder="Single Room Price"
              style={{ width: 150 }}
              name="SingleRoomPrice"
              value={this.state.SingleRoomPrice}
              onChange={this.onChange}
            />
            &nbsp;&nbsp;
            <text>Double Room Price: </text>
            <Input
              placeholder="Double Room Price"
              style={{ width: 150 }}
              name="DoubleRoomPrice"
              value={this.state.DoubleRoomPrice}
              onChange={this.onChange}
            />
            &nbsp;&nbsp;
            <text>Child with bed price: </text>
            <Input
              placeholder="Child With Bed Price"
              style={{ width: 150 }}
              name="ChildWBedPrice"
              value={this.state.ChildWBedPrice}
              onChange={this.onChange}
            />
            &nbsp;&nbsp;
            <text>Child with no bed price: </text>
            <Input
              placeholder="Child With No Bed Price"
              style={{ width: 150 }}
              name="ChildWNoBedPrice"
              value={this.state.ChildWNoBedPrice}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            Extend Night Price
            <br />
            <br />
            <text>Single Room Price: </text>
            <Input
              placeholder="Single Room Price"
              style={{ width: 150 }}
              name="ExtendSingleRoomPrice"
              value={this.state.ExtendSingleRoomPrice}
              onChange={this.onChange}
            />
            &nbsp;&nbsp;
            <text>Double Room Price: </text>
            <Input
              placeholder="Double Room Price"
              style={{ width: 150 }}
              name="ExtendDoubleRoomPrice"
              value={this.state.ExtendDoubleRoomPrice}
              onChange={this.onChange}
            />
            &nbsp;&nbsp;
            <text>Child with bed price: </text>
            <Input
              placeholder="Child With Bed Price"
              style={{ width: 150 }}
              name="ExtendChildWBedPrice"
              value={this.state.ExtendChildWBedPrice}
              onChange={this.onChange}
            />
            &nbsp;&nbsp;
            <text>Child with no bed price: </text>
            <Input
              placeholder="Child With No Bed Price"
              style={{ width: 150 }}
              name="ExtendChildWNoBedPrice"
              value={this.state.ExtendChildWNoBedPrice}
              onChange={this.onChange}
            />
            <br></br>
            <br></br>
            <text>Breakfast: </text>
            <Radio.Group name="Breakfast" defaultvalue={this.state.Breakfast}>
              <Radio value={true} onChange={this.onChange} defaultChecked>
                Provided
              </Radio>
              <Radio value={false} onChange={this.onChange}>
                Do not provide
              </Radio>
            </Radio.Group>
            <br></br>
            <br></br>
            <text>Description: </text>
            <Input
              placeholder="Room Description"
              style={{ width: 150 }}
              name="Description"
              value={this.state.Description}
              onChange={this.onChange}
            />
            <br />
            <br />
            <Button type="primary" onClick={this.handleUpdate}>
              Add Room
            </Button>
          </>
        )}
      </>
    );
  }
}

export default HotelList;
