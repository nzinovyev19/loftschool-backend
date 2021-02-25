const News = require('../model/news');
const User = require('../model/user');
const { v4: uuidv4 } = require('uuid');

async function getNews (req, res) {
  try {
    const news = await News.find();
    res.status(200).json(news.length ? news : []);
  } catch (e) {
    res.status(400).send(e.message);
  }
}

async function createNews (req, res) {
  try {
    const user = await User.findOne({ id: res.locals.userId });
    if (!user.permission.news.C) {
      res.sendStatus(403);
    }
    // TODO: Add validation
    await News.create({
      id: uuidv4(),
      created_at: new Date(),
      text: req.body.text,
      title: req.body.title,
      user: {
        id: user.id,
        image: user.image,
        surName: user.surName,
        username: user.username,
        firstName: user.firstName,
        middleName: user.middleName,
      },
    });
    await getNews(req, res);
  } catch (e) {
    res.status(400).send(e.message);
  }
}

async function setNews (req, res) {
  try {
    const user = await User.findOne({ id: res.locals.userId });
    if (!user.permission.news.U) {
      res.sendStatus(403);
    }
    await News.updateOne({ id: req.params.id }, {
      text: req.body.text,
      title: req.body.title,
    });
    await getNews(req, res);
  } catch (e) {
    res.status(400).send(e.message);
  }
}

async function deleteNews (req, res) {
  try {
    const user = await User.findOne({ id: res.locals.userId });
    if (!user.permission.news.D) {
      res.sendStatus(403);
    }
    await News.deleteOne({ id: req.params.id });
    await getNews(req, res);
  } catch (e) {
    res.status(400).send(e.message);
  }
}

module.exports = {
  getNews,
  setNews,
  createNews,
  deleteNews,
};
