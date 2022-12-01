import React from "react";
import { Button, Box } from "@mui/material";

const TimeSlotPicker = ({ slots, activeSlot, onSelectSlot, currentTime }) => {
  const renderTimeSlot = (slot) => {
    let containerStyles = {
      margin: "2px",
    };

    let title = "Slot";

    let onClick = () => onSelectSlot(slot);

    if (activeSlot === slot.slot) {
      containerStyles = {
        ...containerStyles,
        "& .MuiButton-root": {
          color: "green",
          borderColor: "green",
          fontWeight: 700,
          borderWidth: "2px",
        },
      };
    }

    if (slot.isAlreadyBooked) {
      containerStyles = {
        ...containerStyles,
        "& .MuiButton-root": {
          color: "#ff9966",
          borderColor: "#ff9966",
          borderWidth: "1px",
        },
      };

      title =
        "You have already booked an appointment for this slot. You cannot book this";

      onClick = () => {};
    }

    return (
      <Box key={slot.slot} sx={containerStyles}>
        <Button
          onClick={onClick}
          disabled={slot.full || currentTime >= slot.slot}
          variant="outlined"
          title={title}
        >
          {slot.slot}
        </Button>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      {slots.map(renderTimeSlot)}
    </Box>
  );
};

export default TimeSlotPicker;
