// module.exports = {
//   apps: [
//     {
//       name: "publisher-client",
//       script: "npm",
//       args: "run preview",
//       env: {
//         "NODE_ENV": "production"
//       }
//     }
//   ]
// };

module.exports = {
  apps: [
    {
      name: 'publisher-client',
      script: 'npm',
      args: 'run preview', // или 'run dev' для development
      env: {
        NODE_ENV: 'development',
        VITE_API_BASE_URL: 'http://localhost:3035',
      },
      env_production: {
        NODE_ENV: 'production',
        VITE_API_BASE_URL: 'https://ms-back.ao-dev.ru',
      }
    }
  ]
};