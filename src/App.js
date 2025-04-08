import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./App.css";
import Setting from "./Settings";
import { start, stop, setCount, finish } from "./actions";
import { connect } from "react-redux";
import { showNotification } from "./notification";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CircularProgress from "@mui/material/CircularProgress";
import { Fab } from "@mui/material";
import Favicon from "react-favicon";

// タイマーの表示
const Clock = (props) => {
  const sec = Math.floor(props.time / 1000);
  const min = Math.floor(sec / 60);
  const secStr = (sec % 60 < 10 ? "0" : "") + (sec % 60);
  const time = min + ":" + secStr;

  const containerStyle = {
    height: "200px",
    width: "200px",
    lineHeight: "200px",
    position: "relative",
  };

  const progressStyle = {
    transform: "scaleX(-1) rotate(-90deg)",
    position: "absolute",
    left: "50%",
    marginLeft: "-100px",
  };

  const progress = (props.time / props.total / 60 / 1000) * 100;

  return (
    <div style={containerStyle}>
      <CircularProgress
        variant="determinate"
        color="inherit"
        thickness={2}
        style={progressStyle}
        size={200}
        value={progress}
      />
      <div style={{ fontSize: "40px" }}>{time}</div>
      <Favicon url="/favicon.ico" alertCount={min} />
    </div>
  );
};

const StartButtonPre = (props) => {
  const start = (
    <Fab onClick={props.onStart} title="Start">
      <PlayArrowIcon />
    </Fab>
  );
  const stop = (
    <Fab onClick={props.onStop} title="Stop">
      <PauseIcon />
    </Fab>
  );

  return <div style={{ marginTop: 24 }}>{props.isRunning ? stop : start}</div>;
};

const StartButton = connect(
  (state) => ({
    isRunning: !!state.timer.startedAt,
  }),
  (dispatch) => ({
    onStart: () => dispatch(start(new Date().getTime())),
    onStop: () => dispatch(stop()),
  })
)(StartButtonPre);

const AppPres = (props) => {
  const [remainingTime, setRemainingTime] = useState(props.remainingTime);

  useEffect(() => {
    setRemainingTime(props.remainingTime);
  }, [props.remainingTime]);

  useEffect(() => {
    if (!props.isRunning) return;

    const interval = setInterval(() => {
      let remaining =
        props.remainingTime - (new Date().getTime() - props.startedAt);
      if (remaining > 0) {
        setRemainingTime(remaining);
      } else {
        showNotification("Time is up!", () => {
          props.onNotificationClicked();
        });
        if (props.isWorking) {
          props.onWorkEnd(props.count);
        } else {
          props.onBreakEnd();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    props.isRunning,
    props.remainingTime,
    props.startedAt,
    props.isWorking,
    props.count,
    props.onNotificationClicked,
    props.onWorkEnd,
    props.onBreakEnd,
  ]);

  return (
    <div className={props.className}>
      <Clock time={remainingTime} total={props.total} />
      <StartButton />
      <div style={{ marginTop: 24 }}> 達成済みセット数: {props.count} </div>
      <Setting />
    </div>
  );
};

AppPres.propTypes = {
  startedAt: PropTypes.number,
  remainingTime: PropTypes.number,
  isRunning: PropTypes.bool,
  className: PropTypes.string,
  isWorking: PropTypes.bool,
  count: PropTypes.number,
  total: PropTypes.number,
  onNotificationClicked: PropTypes.func,
  onWorkEnd: PropTypes.func,
  onBreakEnd: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    startedAt: state.timer.startedAt,
    remainingTime: state.timer.remainingTime,
    isRunning: state.timer.startedAt != null,
    className: state.timer.isWorking ? "App App-working" : "App App-break",
    isWorking: state.timer.isWorking,
    count: state.timer.count,
    total: state.timer.isWorking
      ? state.setting.workTime
      : state.setting.breakTime,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onBreakEnd: () => dispatch(finish()),
  onWorkEnd: (currentCount) => {
    dispatch(setCount(currentCount + 1));
    dispatch(finish());
  },
  onNotificationClicked: () => dispatch(start(new Date().getTime())),
});

const AppComp = connect(mapStateToProps, mapDispatchToProps)(AppPres);

const theme = createTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <AppComp />
  </ThemeProvider>
);

export default App;
