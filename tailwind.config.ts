import type { Config } from "tailwindcss";
import path from "path";

const config: Config = {
  // Gunakan gabungan path agar lebih presisi
  content: [
    path.join(__dirname, "./src/**/*.{js,ts,jsx,tsx,mdx}"),
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;