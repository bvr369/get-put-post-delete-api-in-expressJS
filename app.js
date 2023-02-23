const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
app.use(express.json());
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Db error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT 
    *
    FROM
    cricket_team
    ORDER BY
    player_id`;

  const dbResponse = await db.all(getPlayersQuery);
  response.send(dbResponse);
});

app.post("/players/", async (request, response) => {
  const { playerDetails } = request.body;
  const { playerName, jerseyNumber, role } = playersDetails;
  const createPlayerQuery = `
    INSERT INTO
    cricket_team (playerName, jerseyNumber, role)
    VALUES
    ${playerName},
    ${jerseyNumber},
    ${role};`;
  await db.run(createPlayerQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT *
    FROM cricket_team
    WHERE player_id = ${playerId};`;
  let dbResponse = await db.get(getPlayerQuery);
  response.send(dbResponse);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerDetails } = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE 
    cricket_team
    SET
    playerName = '${playerName}',
    jerseyNumber = '${jerseyNumber}',
    role = '${role}'
    WHERE
    player_id = ${playerId};
    `;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE 
    FROM
    cricket_team
    WHERE
    player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
