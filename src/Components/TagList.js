import React, { Component } from "react";
import { Table, Tag, Button, Input, List } from "antd";
import { db } from "../utils/firebase";

class TagList extends Component {
  state = {
    Tag: [],
    selectedTag: "",
  };

  componentDidMount() {
    this.getTag();
  }

  getTag = async () => {
    try {
      db.collection("Tag")
        .get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          //console.log(data); // array
          this.handleTagData(data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  handleTagData = (Tag) => {
    let data = [];
    let id = 1;
    Tag.map((tag) => {
      data.push({
        Id: id,
        Name: tag.TagName,
        Tag: tag,
      });
      id++;
    });

    this.setState(
      {
        Tag: data,
      },
      () => {}
    );
  };

  handleDeleteTag = async (Tag) => {
    try {
      const stateRef = db.collection("Tag").doc(Tag.TagID).delete();

      this.setState(
        {
          selectedTag: "",
        },
        () => {
          this.getTag();
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
        title: "Delete",
        dataIndex: "Tag",
        render: (Tag) => {
          return (
            <Button
              type="primary"
              onClick={this.handleDeleteTag.bind(this, Tag)}
            >
              Delete
            </Button>
          );
        },
        ellipsis: true,
      },
    ];

    return <Table columns={column} dataSource={this.state.Tag} />;
  }
}

export default TagList;
