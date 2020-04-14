const New = require('../model/new');

module.exports = {
  getNews: (req, res) => {
    try {
      console.log(req.body);
      const news = New.find();
      console.log(news);
    } catch (error) {

    }
  },
};
