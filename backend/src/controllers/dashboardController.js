const { getDashboardSummary } = require("../services/dashboardService");

function getDashboard(req, res) {
  res.json(getDashboardSummary());
}

module.exports = {
  getDashboard
};
