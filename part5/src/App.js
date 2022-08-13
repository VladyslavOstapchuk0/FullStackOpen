import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  // const [newBlog, setNewBlog] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogsAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      // setErrorMessage('Wrong credentials');
      // setTimeout(() => {
      //   setErrorMessage(null);
      // }, 5000);
    }
  };

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogsAppUser');
    setUser(null);
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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  // const blogForm = () => (
  //   <form onSubmit={addBlog}>
  //     <input value={newBlog} onChange={handleBlogChange} />
  //     <button type="submit">save</button>
  //   </form>
  // );

  return (
    <div>
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>
            {user.username} logged in{' '}
            <button onClick={handleLogout}>Logout</button>
          </p>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
