import React, { useEffect } from "react";

const circles = new Audio("../../sounds/circles-instrumental.mp3");
const ocean = new Audio("../../sounds/niceOceanSounds.mp3");
const pumpUp = new Audio("../../sounds/pump-up.mp3");

export function Sound({ song }) {
  useEffect(() => {
    if (!song) {
      return;
    }

    const stopAllSongs = () => {
      circles.pause();
      ocean.pause();
      pumpUp.pause();
      circles.currentTime = 0;
      ocean.currentTime = 0;
      pumpUp.currentTime = 0;
    };

    if (song === "circles") {
      circles.play();
    } else if (song === "pumpUp") {
      pumpUp.play();
      pumpUp.currentTime = 10;
    } else if (song === "ocean") {
      ocean.play();
      ocean.currentTime = 2;
    } else {
      stopAllSongs();
    }

    return () => {
      stopAllSongs();
    };
  }, [song]);

  return <div></div>;
}
