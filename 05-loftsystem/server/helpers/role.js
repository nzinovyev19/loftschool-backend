module.exports = {
  user: {
    chat: { C: false, R: true, U: false, D: false },
    news: { C: false, R: true, U: false, D: false },
    settings: { C: false, R: false, U: false, D: false },
  },
  admin: {
    chat: { C: true, R: true, U: true, D: true },
    news: { C: true, R: true, U: true, D: true },
    settings: { C: true, R: true, U: true, D: true },
  },
};
