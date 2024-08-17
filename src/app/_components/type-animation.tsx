"use client";

import { TypeAnimation } from "react-type-animation";

export function Typing() {
  return (
    <TypeAnimation
      sequence={[
        "One", // Types 'One'
        1000, // Waits 1s
        "Two", // Deletes 'One' and types 'Two'
        2000, // Waits 2s
        "Two Three", // Types 'Three' without deleting 'Two'
      ]}
      wrapper="span"
      cursor={true}
      repeat={Infinity}
      // style={{ color: theme.colors["green-400"] }}
      className="text-6xl text-green-400"
    />
  );
}
