import React, { Component } from "react";
import axios from 'axios';
import './App.css';


class App extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  // Fetch data, checks if data has changed, updates UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // Kills unused processes
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }



  // Fetches data using backend api
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };

  // Creates new query using backend api
  putDataToDB = (message) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      message: message,
    });
  };

  // Delete method
  deleteFromDB = (idToDelete) => {
    parseInt(idToDelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if (dat.id == idToDelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  // Update method
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach((dat) => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply },
    });
  };


  render() {
    const { data } = this.state;
    return (
      <div>
        <div className='Body'>
          <ul className='Label'>
            {data.length <= 0
              ? 'NO DB ENTRIES YET'
              : data.map((dat) => (
                <li style={{ padding: '10px' }} key={data.message}>
                  <span> id: </span> {dat.id} <br />
                  <span> data: </span>
                  {dat.message}
                </li>
              ))}
          </ul>
          <div className='TextBoxContainer'>
            <textarea className='TextBox'
              rows="1"
              onChange={(e) => this.setState({ message: e.target.value })}
              placeholder="add to the database"
            />
            <button className='Button' onClick={() => this.putDataToDB(this.state.message)}>
              ADD
          </button>
          </div>
          <div className='TextBoxContainer'>
            <textarea className='TextBox'
              rows="1"
              onChange={(e) => this.setState({ idToDelete: e.target.value })}
              placeholder="put id of item to delete here"
            />
            <button className='Button' onClick={() => this.deleteFromDB(this.state.idToDelete)}>
              DELETE
          </button>
          </div>
          <div className='TextBoxContainer'>
            <textarea className='TextBox'
              rows="1"
              onChange={(e) => this.setState({ idToUpdate: e.target.value })}
              placeholder="id of item to update"
            />
            <textarea className='TextBox'
              rows="1"
              onChange={(e) => this.setState({ updateToApply: e.target.value })}
              placeholder="new value of item"
            />
            <button className='Button'
              onClick={() =>
                this.updateDB(this.state.idToUpdate, this.state.updateToApply)
              }
            >
              UPDATE
          </button>
          </div>
        </div>
      </div>
    );
  }
}


export default App;
