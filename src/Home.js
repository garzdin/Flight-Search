import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import AutoComplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      originFieldError: null,
      destinationFieldError: null,
      selectedOrigin: null,
      selectedDestionation: null,
      departureDate: null,
      returnDate: null,
      oneWay: false
    };
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.onOriginChosen = this.onOriginChosen.bind(this);
    this.onDestionationChosen = this.onDestionationChosen.bind(this);
    this.onDepartureDateChanged = this.onDepartureDateChanged.bind(this);
    this.onReturnDateChanged = this.onReturnDateChanged.bind(this);
    this.searchFlights = this.searchFlights.bind(this);
    this.onOneWayToggle = this.onOneWayToggle.bind(this);
    this.apiKey = "5Ta6I2ly8G6ZgGky2Y8CXCyVEpYucUDz";
  }

  handleUpdateInput(e) {
    if (e) {
      fetch('https://api.sandbox.amadeus.com/v1.2/airports/autocomplete?apikey=5Ta6I2ly8G6ZgGky2Y8CXCyVEpYucUDz&term=' + e)
      .then(response => response.json())
      .then((json) => {
        this.setState({ dataSource: json });
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  onOriginChosen(selection) {
    this.setState({ selectedOrigin: selection });
  }

  onDestionationChosen(selection) {
    this.setState({ selectedDestionation: selection, oneWay: false });
  }

  onDepartureDateChanged(event, date) {
    let dateString = date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDay();
    this.setState({ departureDate: dateString });
  }

  onReturnDateChanged(event, date) {
    let dateString = date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDay();
    this.setState({ returnDate: dateString });
  }

  onOneWayToggle(event, isChecked) {
    this.setState({ oneWay: isChecked });
  }

  searchFlights(event) {
    this.setState({ originFieldError: null, destinationFieldError: null });
    if (!this.state.selectedOrigin) {
      this.setState({ originFieldError: "Origin is required" });
      return false;

    }
    if (!this.state.selectedDestionation) {
      this.setState({ destinationFieldError: "Origin is required" });
      return false;
    }
  }

  render() {
    return (
      <div>
        <AppBar
          title="Flight search"
        />
        <div className="row">
          <AutoComplete
            hintText="Origin of your flight"
            errorText={this.state.originFieldError}
            dataSource={this.state.dataSource}
            dataSourceConfig={{
              text: 'label',
              value: 'value'
            }}
            onUpdateInput={this.handleUpdateInput}
            onNewRequest={this.onOriginChosen}
            floatingLabelText="Origin"
            fullWidth={true}
          />
          <AutoComplete
            hintText="Destination of your flight"
            errorText={this.state.destinationFieldError}
            dataSource={this.state.dataSource}
            dataSourceConfig={{
              text: 'label',
              value: 'value'
            }}
            onUpdateInput={this.handleUpdateInput}
            onNewRequest={this.onDestionationChosen}
            floatingLabelText="Destination"
            fullWidth={true}
          />
          <DatePicker
            name="departure"
            hintText="Departure date (none)"
            onChange={this.onDepartureDateChanged}
            style={{
              float: 'left',
              marginTop: '20px'
            }}
          />
          <DatePicker
            name="return"
            hintText="Return date (none)"
            onChange={this.onReturnDateChanged}
            style={{
              float: 'right',
              marginTop: '20px',
              marginBottom: '20px'
            }}
          />
          <Toggle
            label="One-way"
            onToggle={this.onOneWayToggle}
          />
          <RaisedButton
            label="Search"
            primary={true}
            fullWidth={true}
            onTouchTap={this.searchFlights}
            style={{
              marginTop: '20px'
            }}
          />
        </div>
      </div>
    );
  }
}

export default Home;
