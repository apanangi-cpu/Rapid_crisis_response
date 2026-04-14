import { useEffect } from "react";
import logo from "../assets/logo.png";

export default function IntroAnimation({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro-screen">
      <div className="light-flash"></div>

      <div className="logo-wrapper">
        <img src={logo} alt="CrisisSync" className="intro-logo" />
      </div>
    </div>
  );
}