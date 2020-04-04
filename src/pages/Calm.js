import React, { useState, useEffect } from "react";
import { Nav } from "../components/Nav";

export function Calm({ user, notion }) {
  const stepInit = "init";
  const stepStarted = "started";
  const stepStopped = "stopped";

  const [calm, setCalm] = useState(0);
  const [step, setStep] = useState(stepInit);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [userMessage, setUserMessage] = useState("init");

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
    if (step === stepInit) {
      setUserMessage("Please put your phone away");
    } else if (step === stepStarted) {
      setUserMessage("Focus on the present");
    } else {
      // stopped
      setUserMessage("Your results are");
    }
  }, [step]);

  const sessionDurationMS = 10 * 1000; // seconds multiplied by milli
  let sessionTimeout = null;

  function initializeSession() {
    console.log("Session init");
    setSessionStarted(true);
    setStep(stepInit);
    setTimeout(() => {
      setStep(stepStarted);
      console.log("Session started");
    }, 3000);
    setTimeout(() => {
      console.log("session over");
      setSessionStarted(false);
      setStep(stepStopped);
    }, sessionDurationMS);
  }

  return (
    <main className="main-container">
      {user ? <Nav notion={notion} /> : null}
      <div className="calm-score">
        &nbsp;{(calm * 100).toFixed(0)}% <div className="calm-word">Calm</div>
      </div>
      {sessionStarted ? (
        <div>{userMessage}</div>
      ) : (
        <button onClick={initializeSession}>Get me focused</button>
      )}
      {step === stepStopped ? <div>{userMessage}</div> : null}
    </main>
  );
}
