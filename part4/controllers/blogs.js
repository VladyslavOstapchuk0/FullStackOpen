const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body;
  const token = req.token;
  const user = req.user;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ err: 'token missing or invalid' });
  }

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
  const token = req.token;
  const user = req.user;

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ err: 'token missing or invalid' });
  }

  const id = req.params.id;
  const blog = await Blog.findById(id);
  if (!blog) return res.status(400).json({ err: 'no blog with such id' });

  if (blog.user.toString() === user.id.toString()) {
    await Blog.deleteOne({ _id: id });
    res.status(204).end();
  } else {
    res.status(403).json({ err: 'unauthorized' });
  }
});

blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body;
  const token = req.token;
  const user = req.user;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ err: 'token missing or invalid' });
  }

  const id = req.params.id;
  const blog = await Blog.findById(id);
  if (!blog) return res.status(400).json({ err: 'no blog with such id' });

  if (blog.user.toString() === user.id.toString()) {
    const updatedBlog = {
      title,
      author,
      url,
      likes,
    };
    const result = await Blog.updateOne({ _id: id }, updatedBlog, {
      new: true,
    });
    result ? res.status(200).json(updatedBlog) : res.status(400).end();
  } else {
    res.status(403).json({ err: 'unauthorized' });
  }
});

module.exports = blogsRouter;
