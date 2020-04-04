import React, { useEffect } from "react";

const circlesSounds = new Audio("../../sounds/circles-instrumental.mp3");

export function Sound({ sessionStarted }) {
  useEffect(() => {
    if (sessionStarted) {
      circlesSounds.play();
      circlesSounds.currentTime = 0;
    } else {
      circlesSounds.pause();
    }
  }, [sessionStarted]);

  return <div></div>;
}
