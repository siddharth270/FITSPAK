import Dexie from "dexie";

const db = new Dexie("IronLogDB");

db.version(1).stores({
  workouts: "id, date, startedAt, finishedAt",
  routines: "day",
  weightEntries: "date",
  settings: "key",
});

export default db;
