import React from "react";
import "./DateTimePicker.css"; // Import the custom CSS

const DateTimePicker = ({ dateTime, setDateTime }: any) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (dateTime) {
      // Update the date part of the Date object
      const [year, month, day] = e.target.value.split("-").map(Number);
      const newDateTime = new Date(dateTime);
      newDateTime.setFullYear(year, month - 1, day);
      setDateTime(newDateTime);
    } else {
      setDateTime(new Date(e.target.value));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (dateTime) {
      // Update the time part of the Date object
      const [hours, minutes] = e.target.value.split(":").map(Number);
      const newDateTime = new Date(dateTime);
      newDateTime.setHours(hours, minutes);
      setDateTime(newDateTime);
    } else {
      const newTime = new Date();
      const [hours, minutes] = e.target.value.split(":").map(Number);
      newTime.setHours(hours, minutes);
      setDateTime(newTime);
    }
  };

  return (

      <div className="datetimepicker-container fade-in">
        <input type="date" onChange={handleDateChange} className="date-input" />
        <input type="time" onChange={handleTimeChange} className="time-input" />
      </div>
  
  );
};

export default DateTimePicker;
