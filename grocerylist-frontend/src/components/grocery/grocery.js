import React, { Component } from "react";
import axios from "axios";
import Button from "../common/Button";
import GroceryList from "./GroceryList";
import "./Grocery.css";

const URL = "http://localhost:3001";

export class Grocery extends Component {
  state = {
    groceryList: [],
    groceryInput: "",
    error: null,
    errorMessage: "",
  };

  async componentDidMount() {
    try {
      let allGroceries = await axios.get(
        `${URL}/api/grocery/get-all-groceries`
      );
      console.log(allGroceries);
      console.log(allGroceries.data);
      console.log(allGroceries.data.payload);
      this.setState({
        groceryList: allGroceries.data.payload,
      });
    } catch (e) {
      console.log(e);
    }
  }

  handleGroceryOnChange = (event) => {
    this.setState({
      groceryInput: event.target.value,
      error: null,
      errorMessage: "",
    });
  };

  handleOnSubmit = async (event) => {
    event.preventDefault();
    if (this.state.groceryInput.length === 0) {
      this.setState({
        error: true,
        errorMessage: "Cannot create grocery if empty",
      });
    } else {
      let checkIfGroceryAlreadyExists = this.state.groceryList.findIndex(
        (item) =>
        item.grocery.toLocaleLowerCase() ===
        this.state.groceryInput.toLocaleLowerCase()
      );
      if (checkIfGroceryAlreadyExists > -1) {
        this.setState({
          error: true,
          errorMessage: "Grocery already exists",
        });
      } else {
        try {
          let createdGrocery = await axios.post(
            `${URL}/api/grocery/create-grocery`,
            {
              grocery: this.state.groceryInput,
            }
          );
          console.log(createdGrocery);
          let newArray = [
            ...this.state.groceryList,
            createdGrocery.data.payload,
          ];
          this.setState({
            groceryList: newArray,
            groceryInput: "",
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  handleDeleteByID = async (_id) => {
    try {
      let deletedGrocery = await axios.delete(
        `${URL}/api/grocery/delete-grocery-by-id/${_id}`
      );
      let filteredArray = this.state.groceryList.filter(
        (item) => item._id !== deletedGrocery.data.payload._id
      );
      this.setState({
        groceryList: filteredArray,
      });
    } catch (e) {
      console.log(e);
    }
  };

  handleDoneByID = async (id, purchased) => {
    try {
      let groceryIsDoneUpdated = await axios.put(
        `${URL}/api/grocery/update-purchased-by-id/${id}`,
        {
          purchased: !purchased,
        }
      );
      let updatedArray = this.state.groceryList.map((item) => {
        if (item._id === groceryIsDoneUpdated.data.payload._id) {
          item.purchased = groceryIsDoneUpdated.data.payload.purchased;
        }
        return item;
      });
      this.setState({
        groceryList: updatedArray,
      });
    } catch (e) {
      console.log(e);
    }
  };

  handleEditByID = async (id, editInput) => {
    try {
      let editedGrocery = await axios.put(
        `${URL}/api/grocery/update-grocery-by-id/${id}`,
        {
          grocery: editInput,
        }
      );
      console.log(editedGrocery);
      let updatedGroceryArray = this.state.groceryList.map((item) => {
        if (item._id === id) {
          item.grocery = editedGrocery.data.payload.grocery;
        }
        return item;
      });
      this.setState({
        groceryList: updatedGroceryArray,
      });
    } catch (e) {
      console.log(e);
    }
  };

  sortByDate = async (sortOrder) => {
    try {
      let sortedGrocery = await axios.get(
        `${URL}/api/grocery/get-grocery-by-sort?sort=${sortOrder}`
      );
      this.setState({
        groceryList: sortedGrocery.data.payload,
      });
    } catch (e) {
      console.log(e);
    }
  };

  sortByDone = async (purchased) => {
    try {
      let isPurchasedGroceryArray = await axios.get(
        `${URL}/api/grocery/get-grocery-by-purchased?purchased=${purchased}`
      );
      this.setState({
        groceryList: isPurchasedGroceryArray.data.payload,
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div>
        <div className="form-div">
          <form onSubmit={this.handleOnSubmit}>
            <input
              name="groceryInput"
              type="text"
              onChange={this.handleGroceryOnChange}
              value={this.state.groceryInput}
              autoFocus
              id="inputGrocery"
            />
            <button type="submit">Submit</button>
            <br />
            <span style={{ color: "red" }}>
              {this.state.error && this.state.errorMessage}
            </span>
          </form>
        </div>
        <div className="sorting">
          <ul>
            <li>
              <Button
                buttonName="Sort by Date - Newest to Oldest"
                clickFunc={() => this.sortByDate("desc")}
              />
            </li>
            <li>
              <Button
                buttonName="Sort by Date - Oldest to Newest"
                clickFunc={() => this.sortByDate("asc")}
              />
            </li>
            <li>
              <Button
                buttonName="Sort by Purchased"
                clickFunc={() => this.sortByDone("true")}
              />
            </li>
            <li>
              <Button
                buttonName="Sort by Not Purchased"
                clickFunc={() => this.sortByDone("false")}
              />
            </li>
          </ul>
        </div>
        <div className="grocery-div">
          <ul>
            {this.state.groceryList.map((item, index) => {
              return (
                <GroceryList
                  key={item._id}
                  item={item}
                  handleDeleteByID={this.handleDeleteByID}
                  handleDoneByID={this.handleDoneByID}
                  handleEditByID={this.handleEditByID}
                  inputID={item._id}
                />
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Grocery;