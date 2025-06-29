const config = {
  content: [
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /^text-(blue|gray|violet|red|emerald)-[3-9]00$/,
      variants: ["hover", "active"],
    },
    {
      pattern: /^bg-(blue|gray|violet|red|emerald)-[3-9]00$/,
      variants: ["hover", "active"],
    },
    "text-gray-800",
    "text-gray-300",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
