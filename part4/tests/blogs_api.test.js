const supertest = require('supertest');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

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

  describe('addition of a new blog', () => {
    let token = null;
    beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash('12345', 10);
      const user = await new User({ username: 'name', passwordHash }).save();

      const tokenUser = { username: 'name', id: user.id };
      return (token = jwt.sign(tokenUser, process.env.SECRET));
    });

    test('succeeds with valid data by authorized user', async () => {
      const newBlog = {
        title: 'New blog',
        author: 'author',
        url: 'github.com',
        likes: 7,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

      const titles = blogsAtEnd.map((blog) => blog.title);
      expect(titles).toContain(newBlog.title);
    });

    test('succeeds with valid data and no likes property, but likes defaults to 0', async () => {
      const newBlogWithoutLikes = {
        title: 'New blog to be added',
        author: 'Vladyslav Ostapchuk',
        url: 'newCoolBlog.com',
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

      const likes = blogsAtEnd.map((blog) => blog.likes);
      expect(likes).toContain(0);
    });

    test('fails with 400, when blog has no title and url', async () => {
      const newBlogWithoutUrlAndTitle = {
        author: 'Vladyslav Ostapchuk',
        likes: 10,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlogWithoutUrlAndTitle)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });

    test('fails with 401 if user is not authorized', async () => {
      const newBlog = {
        title: 'New blog',
        author: 'author',
        url: 'github.com',
        likes: 7,
      };

      let token = null;

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(401);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });
  });

  describe('deletion of a blog', () => {
    let token = null;
    beforeEach(async () => {
      token = null;
      await Blog.deleteMany({});
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash('12341234', 10);

      const user = await new User({
        username: 'user1',
        passwordHash,
      });
      const savedUser = await user.save();

      const tokenUser = { username: 'user1', id: savedUser.id };
      token = jwt.sign(tokenUser, process.env.SECRET);

      const newBlog = {
        title: 'New blog',
        author: 'author',
        url: 'github.com',
        likes: 7,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      return token;
    });

    test('succeeds with 204 if id is valid', async () => {
      const blogsAtStart = await Blog.find({}).populate('user');
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await Blog.find({}).populate('user');
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

      const titles = blogsAtEnd.map((blog) => blog.title);
      expect(titles).not.toContain(blogToDelete.title);
    });

    test('fails with 400 if id is invalid', async () => {
      const blogsAtStart = await Blog.find({}).populate('user');
      const blogToDelete = await helper.nonExistingId();

      await api
        .delete(`/api/blogs/${blogToDelete}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      const blogsAtEnd = await Blog.find({}).populate('user');
      expect(blogsAtEnd).toStrictEqual(blogsAtStart);
    });

    test('fails with 401 if user is not authorized', async () => {
      const blogsAtStart = await Blog.find({}).populate('user');
      const blogToDelete = blogsAtStart[0];

      token = null;

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401);

      const blogsAtEnd = await Blog.find({}).populate('user');
      expect(blogsAtEnd).toStrictEqual(blogsAtStart);
    });
  });

  describe('update of a blog', () => {
    let token = null;
    beforeEach(async () => {
      token = null;
      await Blog.deleteMany({});
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash('12341234', 10);
      const user = new User({ username: 'user1', passwordHash });
      await user.save();

      const tokenUser = { username: 'user1', id: user.id };
      token = jwt.sign(tokenUser, process.env.SECRET);

      const newBlog = {
        title: 'New blog',
        author: 'author',
        url: 'github.com',
        likes: 7,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      return token;
    });

    test('succeeds with 200 if data and id is valid', async () => {
      const blogsAtStart = await Blog.find({}).populate('user');
      const blogToUpdate = blogsAtStart[0];

      const blogUpdateInfo = {
        title: 'Updated blog',
        author: 'Vladyslav Ostapchuk',
        url: 'https://github.com/VladyslavOstapchuk0/FullStackOpen/',
        likes: 789,
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogUpdateInfo)
        .expect(200);

      const blogsAtEnd = await helper.blogsInDb();
      const updatedBlog = blogsAtEnd[0];

      expect(updatedBlog.title).toBe(blogUpdateInfo.title);
    });

    test('changes likes by 1', async () => {
      const blogsAtStart = await Blog.find({}).populate('user');
      const blogToUpdate = blogsAtStart[0];

      const blogUpdateInfo = {
        ...blogsAtStart[0],
        likes: blogsAtStart[0].likes + 1,
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogUpdateInfo)
        .expect(200);

      const blogsAtEnd = await Blog.find({}).populate('user');
      const updatedBlog = blogsAtEnd[0];

      expect(updatedBlog.likes).toBe(blogUpdateInfo.likes);
    });

    test('fails with 400 if data is invalid', async () => {
      const blogsAtStart = await Blog.find({});
      const blogToUpdate = blogsAtStart[0];

      await api
        .put(`/api/blogs/${blogToUpdate}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likes: 100 })
        .expect(400);

      const blogsAtEnd = await Blog.find({}).populate('user');
      const updatedBlog = blogsAtEnd[0];

      expect(updatedBlog.likes).toBe(blogsAtStart[0].likes);
    });

    test('fails with 400 if id is invalid', async () => {
      const blogToUpdate = await helper.nonExistingId();
      const blogUpdateInfo = {
        title: 'Updated blog',
        author: 'Vladyslav Ostapchuk',
        url: 'https://github.com/VladyslavOstapchuk0/FullStackOpen/',
        likes: 789,
      };

      await api
        .put(`/api/blogs/${blogToUpdate}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogUpdateInfo)
        .expect(400);
    });

    test('fails with 401 if user is not authorized', async () => {
      const blogsAtStart = await Blog.find({});
      const blogToUpdate = blogsAtStart[0];

      const blogUpdateInfo = {
        title: 'Updated blog',
        author: 'Vladyslav Ostapchuk',
        url: 'https://github.com/VladyslavOstapchuk0/FullStackOpen/',
        likes: 789,
      };

      let token = null;

      await api
        .put(`/api/blogs/${blogToUpdate}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogUpdateInfo)
        .expect(401);

      const blogsAtEnd = await Blog.find({}).populate('user');
      const updatedBlog = blogsAtEnd[0];

      expect(updatedBlog.likes).toBe(blogsAtStart[0].likes);
    });
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.err).toContain('username must be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if username/password is invalid', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'u',
      name: 'Superuser',
      password: '12',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.err).toContain('validation failed');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
