/**
 *   SQLite (Simple) - Owen Mundy 2024
 */

//////////////////////////////////////
////////////// PARAMS ////////////////
//////////////////////////////////////

// database file path
const dbFile = "./.data/bigFeelings.db";
// main database table
const table = "Feelings";

//////////////////////////////////////
////////////// DATABASE //////////////
//////////////////////////////////////

// import sqlite3
import sqlite3 from "sqlite3";
// check if database has been created
import * as fs from "fs";
// database reference
const database = new sqlite3.Database(dbFile);

//////////////////////////////////////
/////////////// SETUP ////////////////
//////////////////////////////////////

// if database file doesn't exist, create it
(async () => {
  if (!fs.existsSync(dbFile)) {
    console.warn("❌ Database does not exist");
  } else {
    console.log("✅ Database already exists");
  }
  // create table (if it doesn't exist already)
  await createTable();
})();

// Create table columns and set their data types
async function createTable() {
  database.run(`CREATE TABLE IF NOT EXISTS ${table} (
          'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
          'feeling' TEXT, 
          'color' TEXT, 
          'lat' TEXT, 
          'lng' TEXT, 
          'datetime' DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')));`);
  console.log("✅ New table created!");
}

//////////////////////////////////////
/////////// PUBLIC FUNCTIONS /////////
//////////////////////////////////////

const db = {
  dbExists: async () => {
    return fs.existsSync(dbFile);
  },
  runQuery: async (sql) => {
    return runQuery(sql);
  },
  getOne: async () => {
    return allQuery(`SELECT * FROM ${table} LIMIT 1;`);
  },
  getAll: async () => {
    return allQuery(`SELECT * FROM ${table};`);
  },
  deleteAll: async () => {
    return clearData();
  },
  addTestData: async () => {
    return addTestData();
  },
  addTestRow: async () => {
    return addTestRow();
  },
};
export default db;

//////////////////////////////////////
//////////// DB FUNCTIONS ////////////
//////////////////////////////////////

// Calls "run" using any SQL query, wrapped in async promise
export async function runQuery(sql) {
  try {
    const response = await new Promise((resolve, reject) => {
      console.log("runQuery() -> sql", sql);
      database.run(sql, (err, result) => {
        console.log("runQuery() -> result", result);
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
    return response;
  } catch (err) {
    console.log(err);
  }
}

// Calls "all" using any SQL query, wrapped in async promise
export async function allQuery(sql) {
  try {
    const response = await new Promise((resolve, reject) => {
      console.log("allQuery() -> sql", sql);
      database.all(sql, (err, result) => {
        // console.log("allQuery() -> result", result);
        if (err) {
          reject(err);
          return [];
        }
        resolve(result);
      });
    });
    return response;
  } catch (err) {
    console.log(err);
  }
}

//////////////////////////////////////
////////////// DEBUGGING /////////////
//////////////////////////////////////

// Logs all data in a table to the console
async function logTable() {
  database.each(`SELECT * from ${table};`, (err, row) => {
    if (row) {
      console.log(`row: ${JSON.stringify(row)}`);
    }
  });
}

// Deletes all data in the table
async function clearData() {
  database.run(`DELETE FROM ${table};`); // remove ALL rows and reset id=0
  database.run(`UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='${table}';`);
  console.log("✅ Table is empty");
}

// Add a new test row
export async function addTestRow(data) {
  // console.log(data);
  try {
    const response = await new Promise((resolve, reject) => {
      let sql = `INSERT INTO ${table} (feeling,color,lat,lng) 
                 VALUES ("${data.feeling}","${data.color}","${data.lat}","${data.lng}");`;
      // console.log("sql", sql);
      database.run(sql, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
    return response;
  } catch (err) {
    console.log(err);
  }
}

// Adds multiple new rows
export async function addTestData(count = 150) {
  for (let i = 0; i < count; i++) {
    let data = await creatTestData();
    await addTestRow(data);
  }
  console.log("✅ Test data added!");
}

//////////////////////////////////////
/////////////// HELPERS //////////////
//////////////////////////////////////

const colors = JSON.parse(fs.readFileSync("./public/colors.json"));
const testGeo = JSON.parse(fs.readFileSync("./data/test-geo.json"));
// console.log(colors);

// creates data for a row
async function creatTestData() {
  let data = colors[Math.floor(Math.random() * colors.length)];
  let geo = randomLatLng() || "";
  data.lat = geo.latitude || "";
  data.lng = geo.longitude || "";
  return data;
}

function randomLatLng() {
  // too random
  // data.lat = randomNumber(-60,60);
  // data.lng = randomNumber(-140,150);
  return testGeo[Math.floor(Math.random() * testGeo.length)];
}

function randomNumber(min, max) {
  min = Number(min);
  max = Number(max);
  return Math.random() * (max - min) + min;
}
