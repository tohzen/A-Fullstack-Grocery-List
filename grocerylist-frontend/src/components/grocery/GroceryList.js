import React, { Component } from "react";
import PropTypes from "prop-types";
import "./groceryList.css";
import Button from "../common/Button";

export class groceryList extends Component {
  state = {
    canEdit: false,
    editInput: this.props.item.grocery,
  };

  onHandleEditClick = () => {
    this.setState((prevState) => {
      return {
        canEdit: !prevState.canEdit,
      };
    });
  };

  handleEditOnChange = (event) => {
    this.setState({
      editInput: event.target.value,
    });
  };

  onHandleEditSubmit = (id) => {
    this.onHandleEditClick();
    this.props.handleEditByID(id, this.state.editInput);
  };

  render() {
    const { grocery, _id, purchased } = this.props.item;
    const { handleDeleteByID, handleDoneByID, inputID } = this.props;
    const { canEdit, editInput } = this.state;

    return (
      <div className="grocerylist-parent">
        <div className="grocerylist-div">
          {canEdit ? (
            <input
              type="text"
              value={editInput}
              onChange={this.handleEditOnChange}
              name="editInput"
            />
          ) : (
            <li className={`li-style ${purchased ? "li-style-isDone" : ""}`}>
              {grocery}
            </li>
          )}
          {canEdit ? (
            <Button
              buttonName="Submit"
              cssid="edit-button"
              clickFunc={() => this.onHandleEditSubmit(_id)}
            />
          ) : (
            <Button
              buttonName="Edit"
              cssid="edit-button"
              clickFunc={() => this.onHandleEditClick(_id)}
            />
          )}
          <Button
            buttonName="Purchased"
            cssid="purchased-button"
            clickFunc={() => handleDoneByID(_id, purchased)}
          />
          <Button
            buttonName="Delete"
            cssid="delete-button"
            clickFunc={() => handleDeleteByID(_id)}
          />
        </div>
      </div>
    );
  }
}
groceryList.propTypes = {
  item: PropTypes.object.isRequired,
  handleDeleteByID: PropTypes.func.isRequired,
  handleDoneByID: PropTypes.func.isRequired,
  handleEditByID: PropTypes.func.isRequired,
};

export default groceryList;