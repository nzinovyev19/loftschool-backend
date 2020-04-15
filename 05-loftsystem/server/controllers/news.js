const New = require('../model/new');

module.exports = {
  getNews: (req, res) => {
    try {
      console.log('news');
      const news = New.find();
      res.status(200).json(null);
    } catch (error) {

    }
  },
};
