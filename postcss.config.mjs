/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // WAJIB ada agar CSS diproses dengan benar
  },
};

export default config;