const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Vladyslav Ostapchuk',
    url: 'https://github.com/',
    likes: 12,
  },

  {
    title: 'Second blog',
    author: 'Vladyslav Ostapchuk',
    url: 'https://google.com/',
    likes: 7,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'willremovethissoon',
    url: 'willremovethissoon',
    like: 0,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
