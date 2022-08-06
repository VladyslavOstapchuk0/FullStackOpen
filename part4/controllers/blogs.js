const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body;

  const blog = new Blog({
    title,
    author,
    url,
    likes,
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  const result = await Blog.findByIdAndRemove(req.params.id);
  result ? res.status(204).end() : res.status(400).end();
});

module.exports = blogsRouter;
