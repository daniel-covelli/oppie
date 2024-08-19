"use client";

import { TypeAnimation } from "react-type-animation";

export function Typing() {
  return (
    <TypeAnimation
      sequence={[
        "A better way to save your knowledge", // Types 'One'
        3000, // Waits 1s
        "A better way to save your code", // Deletes 'One' and types 'Two'
        2000, // Waits 2s
        "A better way to save your insights", // Types 'Three' without deleting 'Two'
        2000,
        "A better way to save your ideas", // Types 'Three' without deleting 'Two'
        2000,
      ]}
      wrapper="span"
      cursor={true}
      repeat={Infinity}
      // style={{ color: theme.colors["green-400"] }}
      className="text-2xl text-slate-50"
    />
  );
}
