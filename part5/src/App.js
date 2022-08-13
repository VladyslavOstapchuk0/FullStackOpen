import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  // const [newBlog, setNewBlog] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

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
    } catch (exception) {
      console.error(exception);
      // setErrorMessage('Wrong credentials');
      // setTimeout(() => {
      //   setErrorMessage(null);
      // }, 5000);
    }
  };

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogsAppUser');
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
    } catch (exception) {
      console.error(exception);
    }
  };

  // const addBlog = (event) => {
  //   event.preventDefault();
  //   const blogObject = {
  //     content: newBlog,
  //     date: new Date().toISOString(),
  //     important: Math.random() > 0.5,
  //     id: blogs.length + 1,
  //   };

  //   blogService.create(blogObject).then((returnedBlog) => {
  //     setBlogs(blogs.concat(returnedBlog));
  //     setNewBlog('');
  //   });
  // };

  // const handleBlogChange = (event) => {
  //   setNewBlog(event.target.value);
  // };

  // const blogForm = () => (
  //   <form onSubmit={addBlog}>
  //     <input value={newBlog} onChange={handleBlogChange} />
  //     <button type="submit">save</button>
  //   </form>
  // );

  return (
    <div>
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
