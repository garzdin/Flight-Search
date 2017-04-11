import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import AutoComplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import {Card, CardHeader, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      originFieldError: null,
      destinationFieldError: null,
      departureDateError: null,
      returnDateError: null,
      selectedOrigin: null,
      selectedDestionation: null,
      departureDate: null,
      returnDate: null,
      oneWay: false,
      loadingStatus: "hide",
      searchResults: [],
      resultsCurrency: null
    };
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.onOriginChosen = this.onOriginChosen.bind(this);
    this.onDestionationChosen = this.onDestionationChosen.bind(this);
    this.onDepartureDateChanged = this.onDepartureDateChanged.bind(this);
    this.onReturnDateChanged = this.onReturnDateChanged.bind(this);
    this.disablePastDates = this.disablePastDates.bind(this);
    this.searchFlights = this.searchFlights.bind(this);
    this.onOneWayToggle = this.onOneWayToggle.bind(this);
    this.baseURL = "https://api.sandbox.amadeus.com/v1.2";
    this.apiKey = "5Ta6I2ly8G6ZgGky2Y8CXCyVEpYucUDz";
  }

  handleUpdateInput(e) {
    if (e) {
      fetch(`${this.baseURL}/airports/autocomplete?apikey=${this.apiKey}&term=${e}`)
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
    this.setState({ departureDate: date.toISOString().split("T")[0] });
  }

  onReturnDateChanged(event, date) {
    this.setState({ returnDate: date.toISOString().split("T")[0] });
  }

  disablePastDates(date) {
    return date < new Date();
  }

  onOneWayToggle(event, isChecked) {
    this.setState({ oneWay: isChecked });
  }

  searchFlights(event) {
    this.setState({ originFieldError: null, destinationFieldError: null, departureDateError: null, returnDateError: null });
    if (!this.state.selectedOrigin) {
      this.setState({ originFieldError: "Origin is required" });
      return false;

    }
    if (!this.state.selectedDestionation) {
      this.setState({ destinationFieldError: "Origin is required" });
      return false;
    }
    if (!this.state.departureDate) {
      this.setState({ departureDateError: "Departure date is required" });
      return false;
    }
    if (!this.state.returnDate) {
      this.setState({ returnDateError: "Return date is required" });
      return false;
    }

    this.setState({ loadingStatus: "loading" });
    fetch(`${this.baseURL}/flights/extensive-search?apikey=${this.apiKey}&origin=${this.state.selectedOrigin.value}&destination=${this.state.selectedDestionation.value}&departure_date=${this.state.departureDate}--${this.state.returnDate}&one-way=${this.state.oneWay}`)
    .then(response => response.json())
    .then(json => {
      this.setState({ loadingStatus: "hide", searchResults: json.results, resultsCurrency: json.currency });
    })
    .catch(error => {
      console.error(error);
    });
  }

  render() {
    return (
      <div>
        <AppBar
          title="Flight Search"
          iconClassNameLeft="none"
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
            filter={AutoComplete.caseInsensitiveFilter}
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
            filter={AutoComplete.caseInsensitiveFilter}
            onUpdateInput={this.handleUpdateInput}
            onNewRequest={this.onDestionationChosen}
            floatingLabelText="Destination"
            fullWidth={true}
          />
          <DatePicker
            name="departure"
            hintText="Departure date"
            errorText={this.state.departureDateError}
            onChange={this.onDepartureDateChanged}
            shouldDisableDate={this.disablePastDates}
            style={{
              float: 'left',
              marginTop: '20px'
            }}
          />
          <DatePicker
            name="return"
            hintText="Return date"
            errorText={this.state.returnDateError}
            onChange={this.onReturnDateChanged}
            shouldDisableDate={this.disablePastDates}
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
              marginTop: '20px',
              marginBottom: '20px'
            }}
          />
          <RefreshIndicator
            size={40}
            left={-20}
            top={20}
            status={this.state.loadingStatus}
            style={{
              position: 'relative',
              marginLeft: '50%'
            }}
          />
        {this.state.searchResults.length > 0 &&
          <div className="search-results">
            <h2>Search results:</h2>
              {
                this.state.searchResults.map((result, index) => (
                  <Card
                    key={index}
                    className="search-results-card">
                    <CardHeader
                      title={this.state.selectedOrigin.value + " - " + result.destination}
                      subtitle={result.departure_date + " - " + result.return_date }
                    />
                    <CardActions>
                      <FlatButton label={result.price + " " + this.state.resultsCurrency} />
                    </CardActions>
                  </Card>
                ))
              }
          </div>
        }
        </div>
      </div>
    );
  }
}

export default Home;
