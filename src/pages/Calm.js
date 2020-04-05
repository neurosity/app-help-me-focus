import React, { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { Sound } from "../components/Sound";

const stepCalculate = "calculate";
const stepInit = "init";
const stepPumpUp = "pump up";
const stepStarted = "started";
const stepStopped = "stopped";
const stepWindDown = "wind down";

export function Calm({ user, notion, status }) {
  const [calm, setCalm] = useState(0);
  const [calmScores, setCalmScores] = useState([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [song, setSong] = useState(null);
  const [step, setStep] = useState(null);
  const [userMessage, setUserMessage] = useState("init");

  const { state, charging, sleepMode } = status || {};

  useEffect(() => {
    if (!user || !notion) {
      return;
    }

    const subscription = notion.calm().subscribe((calm) => {
      setCalm(Number(calm.probability.toFixed(2)));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, notion]);

  useEffect(() => {
    if (sessionStarted) {
      setCalmScores((prevCalmScores) => [...prevCalmScores, calm]);
    }
  }, [calm, sessionStarted]);

  useEffect(() => {
    if (!step) {
      return;
    }

    if (step === stepInit) {
      setUserMessage("Please put your phone away");
      setTimeout(() => {
        setStep(stepStarted);
        console.log("Session init");
      }, 3000);
    } else if (step === stepStarted) {
      setUserMessage("Focus on the present");
      setSong("circles");
      setTimeout(() => {
        console.log("session calculating");
        setStep(stepCalculate);
      }, 3000);
    } else if (step === stepCalculate) {
      setUserMessage("Calculating...");
      const averageCalmScore = computeAverage(calmScores);
      setTimeout(() => {
        if (averageCalmScore > 0.4) {
          setStep(stepPumpUp);
        } else {
          setStep(stepWindDown);
        }
      }, 3000);
    } else if (step === stepPumpUp) {
      setUserMessage("Lets go!");
      setSong("pumpUp");
      setTimeout(() => {
        stopSession();
      }, 60 * 1000);
    } else if (step === stepWindDown) {
      setUserMessage("Enjoy these nice sounds...");
      setSong("ocean");
      setTimeout(() => {
        stopSession();
      }, 60 * 1000);
    } else {
      // stopped
      setSong("none");
      setUserMessage("Session complete!");
    }
  }, [step]);

  const stopSession = () => {
    setSessionStarted(false);
    setStep(stepStopped);
  };

  const initializeSession = () => {
    console.log("Session init");
    setSessionStarted(true);
    setStep(stepInit);
  };

  return (
    <main className="main-container">
      {user ? <Nav notion={notion} status={status} /> : null}
      {sleepMode ? null : (
        <>
          <div className="calm-score">
            &nbsp;{(calm * 100).toFixed(0)}%{" "}
            <div className="calm-word">Calm</div>
          </div>
          {sessionStarted ? (
            <div>{userMessage}</div>
          ) : (
            <button onClick={initializeSession} className="card-btn">
              Get me focused
            </button>
          )}
          <div>{step === stepStopped ? <div>{userMessage}</div> : null}</div>
        </>
      )}
      <Sound sessionStarted={sessionStarted} song={song}></Sound>
    </main>
  );
}

function computeAverage(averages) {
  return (
    averages.reduce((acc, probability) => acc + probability, 0) /
    averages.length
  );
}
