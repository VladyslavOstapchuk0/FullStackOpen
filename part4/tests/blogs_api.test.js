const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe('when there is initially some blogs saved', () => {
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

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
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

  test('succeeds with valid data and no likes property, but likes defaults to 0', async () => {
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

describe('deletion of a blog', () => {
  test('succeeds with 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogsToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogsToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogsToDelete.title);
  });

  test('fails with 400 if id is invalid', async () => {
    const blogToDelete = await helper.nonExistingId();

    await api.delete(`/api/blogs/${blogToDelete}`).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('update of a blog', () => {
  test('succeeds with 200 if data and id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const blogUpdateInfo = {
      title: 'Updated blog',
      author: 'Vladyslav Ostapchuk',
      url: 'https://github.com/VladyslavOstapchuk0/FullStackOpen/',
      likes: 789,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogUpdateInfo)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd[0];

    expect(updatedBlog.title).toBe('Updated blog');
  });

  test('changes likes by 1', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const blogUpdateInfo = {
      ...helper.initialBlogs[0],
      likes: helper.initialBlogs[0].likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogUpdateInfo)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd[0];

    expect(updatedBlog.likes).toBe(helper.initialBlogs[0].likes + 1);
  });

  test('fails with 400 if data is invalid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const blogUpdateInfo = {
      author: 'Vladyslav Ostapchuk',
      likes: 789,
    };

    await api
      .put(`/api/blogs/${blogToUpdate}`)
      .send(blogUpdateInfo)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd[0];

    expect(updatedBlog.likes).toBe(helper.initialBlogs[0].likes);
  });

  test('fails with 400 if id is invalid', async () => {
    const blogToUpdate = await helper.nonExistingId();

    const blogUpdateInfo = { ...helper.initialBlogs[0], likes: 27 };

    await api
      .put(`/api/blogs/${blogToUpdate}`)
      .send(blogUpdateInfo)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
