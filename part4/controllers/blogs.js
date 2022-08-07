const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes, userId } = req.body;
  const user = await User.findById(userId);

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  const result = await Blog.findByIdAndRemove(req.params.id);
  result ? res.status(204).end() : res.status(400).end();
});

blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body;

  const blog = {
    title,
    author,
    url,
    likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });
  updatedBlog ? res.status(200).json(updatedBlog) : res.status(400).end();
});

module.exports = blogsRouter;
