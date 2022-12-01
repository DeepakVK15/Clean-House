import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import moment from "moment";
import "moment-timezone";
import { setTime as setCurrentTime } from "../../store/currentTime";

const TimeElapser = () => {
  const dispatch = useDispatch();
  const [time, setTime] = useState(moment());
  const currentTime = useSelector((state) => state.currentTime.time);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(moment());
    }, 60000);

    return () => clearTimeout(timer);
  });

  const changeCurrentTime = (date) => {
    let changedDate = moment(date);
    changedDate.hour(time.hour());
    changedDate.minutes(time.minutes());
    changedDate.seconds(time.seconds());
    dispatch(setCurrentTime(changedDate));
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flexGrow: 0,
        m: "16px",
      }}
    >
      <div>Real Time: {time.format("L, LT")}</div>
      <Box
        sx={{
          ml: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        Current Time:
        <TextField
          id="date"
          // label="Birthday"
          type="date"
          defaultValue={moment(currentTime).format("YYYY-MM-DD")}
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: moment().add(1, "y").format("YYYY-MM-DD"),
            min: moment().format("YYYY-MM-DD"),
          }}
          value={moment(currentTime).format("YYYY-MM-DD")}
          onChange={(e) => changeCurrentTime(e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default TimeElapser;
