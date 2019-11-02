const DB = require('../DatabaseController.js');

module.exports = class {
  constructor() {

  }

  ////log
  async AddALog(data) {
    var cmd = "INSERT INTO `log` (`UserID`, `ProjectID`, `Title`, `StartTime`, `EndTime`, `Description`) VALUES (?, ?, ?, ?, ?, ?);";
    let dbResult = await DB.query(cmd, [data.UserID, data.ProjectID, data.Title, data.StartTime, data.EndTime, data.Description]);
    if (dbResult)
      return true;
    return false;
  }

  async ModifyALog(data) {
    var cmd = "UPDATE `log` SET `ProjectID` = ?, `Title` = ?, `StartTime` = ?, `EndTime` = ?, `Description` = ? WHERE `LogID` = ?";
    let dbResult = await DB.query(cmd, [data.ProjectID, data.Title, data.StartTime, data.EndTime, data.Description, data.LogID]);
    if (dbResult)
      return true;
    return false;
  }

  async DeleteALog(data) {
    var cmd = "UPDATE `log` SET `IsDeleted` = ? WHERE `LogID` = ?;";
    let dbResult = await DB.query(cmd, [true, data.LogID]);
    if (dbResult)
      return true;
    return false;
  }

  async GetALog(logID) {
    var cmd = "SELECT * FROM `log` WHERE `LogID` = ?;";
    let dbResult = await DB.query(cmd, [logID]);
    if (dbResult.length != 0)
      return dbResult[0];
    return "no data";;
  }

  async GetUserLogsByIterationID(iterationID) {
    var cmd = "SELECT * FROM `log`, `iteration` WHERE `log`.`StartTime` >= `iteration`.`StartDate` AND `log`.`EndTime` <= `iteration`.`EndDate` AND `IterationID` = ? AND `log`.`IsDeleted` = ?";
    let dbResult = await DB.query(cmd, [iterationID, false]);
    return dbResult;
  }

  async GetUserLogsByRange(startDate, endDate) {
    var cmd = "SELECT * FROM `log` WHERE `StartTime` >= ? AND `EndTime` <= ? AND `IsDeleted` = ?"
    return await DB.query(cmd, [startDate, endDate, false])
  }

  async GetUserLogsBySearch(data) {
    var params = [];
    var cmd = "SELECT `log`.* FROM `log` WHERE `log`.`IsDeleted` = ? AND `log`.`UserID` = ? AND (`log`.`Title` LIKE ? OR `log`.`Description` LIKE ?)";
    params.push(false);
    params.push(data.UserID);
    params.push("%" + data.Description + "%", "%" + data.Description + "%");
    if (data.StartTime && data.EndTime) {
      cmd += " AND (`log`.`StartTime` >= ? AND `log`.`EndTime` < ?)";
      params.push(data.StartTime, data.EndTime);
    }
    let dbResult = await DB.query(cmd, params);
    if (dbResult.length != 0)
      return dbResult;
    return "no data";
  }

  ////projects
  async GetUserProjects(userID) {
    var cmd = "SELECT * FROM `project` WHERE `UserID` = ? AND `IsDeleted` = ?";
    let dbResult = await DB.query(cmd, [userID, false]);
    return dbResult;
  }

  async ModifyOrAddAProject(data) {
    var dbResult;
    if (data.ProjectID == null) {
      var cmd = "INSERT INTO `project` (`UserID`, `ProjectName`, `IsPrivate`, `IsEnable`) VALUES (?, ?, ?, ?);";
      dbResult = await DB.query(cmd, [data.UserID, data.ProjectName, data.IsPrivate, data.IsEnable]);
    } else {
      var cmd = "UPDATE `project` SET `ProjectName` = ?, `IsPrivate` = ?, `IsEnable` = ? WHERE `ProjectID` = ?;";
      dbResult = await DB.query(cmd, [data.ProjectName, data.IsPrivate, data.IsEnable, data.ProjectID]);
    }
    if (dbResult)
      return true;
    return false;
  }

  async DeleteAProject(projectID) {
    var cmd = "UPDATE `project` SET `IsDeleted` = ? WHERE `ProjectID` = ?;";
    let dbResult = await DB.query(cmd, [true, projectID]);
    if (dbResult)
      return true;
    return false;
  }

  //target
  async QueryGoalByIteration(data) {
    var cmd = "SELECT * FROM `goal` WHERE `IterationID` =? ;";
    let dbResult = await DB.query(cmd, [data.IterationID]);
    if (dbResult.length > 0)
      return dbResult;
    return "no data";
  }

  async ModifyOrAddAGoal(data) {
    var cmd = "INSERT INTO `goal` (`IterationID`, `ProjectID`, `GoalHour`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `GoalHour` = ?;";
    let dbResult = await DB.query(cmd, [data.IterationID, data.ProjectID, data.GoalHour, data.GoalHour]);
    if (dbResult)
      return true;
    return false;
  }

  //// Iteration
  async QueryIterationByIterationID(iterationID) {
    var cmd = "SELECT * FROM `iteration` WHERE iterationID = ?";
    let dbResult = await DB.query(cmd, [iterationID]);
    if (dbResult.length != 0)
      return dbResult;
    return "no data"
  }
}
