import cron from "node-cron";

/* The 5 fields in cron syntax represent
   minutes, hours, day of month, day of week in the order
*/

cron.schedule("*/2 * * * * *", () => {
  console.log("I am the cron job running");
});
