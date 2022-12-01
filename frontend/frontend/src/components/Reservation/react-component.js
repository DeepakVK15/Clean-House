import React from "react";
import AppointmentPicker from "./dist/appointment-picker.min";
import "./dist/appointment-picker.css";

class AppoPicker extends React.Component {
  constructor(props) {
    super(props);
    this.options = {
      leadingZero: true,
    };
    this.state = { time: {} };
    this.pickerRef = React.createRef();
    this.onTimeSelect = this.onTimeSelect.bind(this);
  }

  onTimeSelect(event) {
    console.log("change.appo.picker", event.time);
    this.setState({ time: event.time });
  }

  render() {
    return (
      <div>
        <input type="text" ref={this.pickerRef}></input>
        <code>{JSON.stringify(this.state.time)}</code>
      </div>
    );
  }

  componentDidMount() {
    this.picker = new AppointmentPicker(this.pickerRef.current, this.options);
    this.pickerRef.current.addEventListener(
      "change.appo.picker",
      this.onTimeSelect
    );
  }

  componentWillUnmount() {
    this.pickerRef.current.removeEventListener(
      "change.appo.picker",
      this.onTimeSelect
    );
    this.picker.destroy();
  }
}

export default AppoPicker;
