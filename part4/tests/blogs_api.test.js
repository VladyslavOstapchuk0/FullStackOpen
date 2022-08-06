const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe('get blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const res = await api.get('/api/blogs');

    expect(res.body).toHaveLength(helper.initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const res = await api.get('/api/blogs');

    const titles = res.body.map((blog) => blog.title);
    expect(titles).toContain('Second blog');
  });

  test('unique identifier is called id and not _id', async () => {
    const res = await api.get('/api/blogs');

    expect(res.body[0]._id).toBeUndefined();
    expect(res.body[1]._id).toBeUndefined();
    expect(res.body[1].id).toBeDefined();
    expect(res.body[1].id).toBeDefined();
  });
});

describe('create new blogs', () => {
  test('blog can be added', async () => {
    const newBlog = {
      title: 'New blog to be added',
      author: 'Vladyslav Ostapchuk',
      url: 'newCoolBlog.com',
      likes: 789,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain('New blog to be added');
  });

  test('when blog has no likes property, it defaults to 0', async () => {
    const newBlogWithoutLikes = {
      title: 'New blog to be added',
      author: 'Vladyslav Ostapchuk',
      url: 'newCoolBlog.com',
    };

    await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const likes = blogsAtEnd.map((blog) => blog.likes);
    expect(likes).toContain(0);
  });

  test('when blog has no title and url, then request is fails with 400', async () => {
    const newBlogWithoutUrlAndTitle = {
      author: 'Vladyslav Ostapchuk',
      likes: 10,
    };

    await api.post('/api/blogs').send(newBlogWithoutUrlAndTitle).expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
