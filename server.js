/**
 * server.js  — Entry Point
 *
 * Binds the Express app to a port and starts listening.
 * Separated from app.js so the app can be imported/tested without
 * binding to a port.
 *
 * Run with:
 *   node server.js          (production)
 *   nodemon server.js       (development, auto-restart)
 *   npm run dev             (uses nodemon via package.json script)
 */

require("dotenv").config();
const app  = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 WIS Backend running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   API base:     http://localhost:${PORT}/api\n`);
});
