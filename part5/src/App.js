import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  // const [newBlog, setNewBlog] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  }, [message]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogsAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setMessage({
        type: 'success',
        text: `Logged in as ${user.username}`,
      });
    } catch (exception) {
      setMessage({
        type: 'error',
        text: 'wrong username or password',
      });
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogsAppUser');
    setMessage({
      text: 'Successful logout',
      type: 'success',
    });
    setUser(null);
  };

  const handleBlogForm = async (title, author, url) => {
    try {
      const blog = await blogService.create({
        title,
        author,
        url,
      });
      setBlogs(blogs.concat(blog));
      setMessage({
        type: 'success',
        text: `a new blog ${blog.title} by ${blog.author} added`,
      });
    } catch (exception) {
      setMessage({
        type: 'error',
        text: 'error adding a new blog, please try again later',
      });
    }
  };

  return (
    <div>
      <Notification message={message} />
      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <div>
          <p>
            {user.username} logged in
            <button onClick={handleLogout}>Logout</button>
          </p>
          <BlogForm handleBlogForm={handleBlogForm} />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
