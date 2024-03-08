function getSessionData(request) {
  const sessionData = request.session.flashedData;

  request.session.flashedData = null;

  return sessionData;
}

function flashDataToSession(request, data, action) {
  request.session.flashedData = data;
  request.session.save(action);
}

module.exports = {
  getSessionData: getSessionData,
  flashDataToSession: flashDataToSession,
};
