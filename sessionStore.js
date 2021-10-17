/* abstract */ class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
  getSessionByUserID(userID) {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions];
  }

  getSessionByUserID(userID) {
    return [...this.sessions].find(
      ([key, value]) => value.userID === userID
    )?.[0];
  }
}

module.exports = {
  InMemorySessionStore,
};
