// eslint-disable-next-line
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, el) => {
    return (sum += el.likes);
  }, 0);
};

const favoriteBlog = (blogs) => {
  const result = blogs.reduce((max, el) => {
    return max.likes >= el.likes ? max : (max = el);
  }, {});

  return {
    author: result.author,
    title: result.title,
    likes: result.likes,
  };
};

const mostBlogs = (blogs) => {
  // Get authors
  const authors = blogs.map((blog) => blog.author);

  // If author has a blog, add to count
  const blogsAuthor = authors.reduce((obj, el) => {
    obj[el] ? obj[el]++ : (obj[el] = 1);

    return obj;
  }, {});

  // find most blogs by author
  const mostBlogsAuthor = Object.entries(blogsAuthor).reduce((max, el) => {
    return blogsAuthor[max] > blogsAuthor[el] ? max : el;
  }, []);

  return {
    author: mostBlogsAuthor[0],
    blogs: mostBlogsAuthor[1],
  };
};

const mostLikes = (blogs) => {
  let authors = blogs.map((blog) => blog.author);
  authors = [...new Set(authors)];

  const likesAuthor = authors.map((author) => {
    const authorBlogs = blogs.filter((blog) => blog.author === author);

    const likesAuthor = authorBlogs.reduce((max, el) => {
      return max + el.likes;
    }, 0);

    return {
      author,
      likes: likesAuthor,
    };
  });

  return likesAuthor.reduce((acc, el) => {
    return acc.likes > el.likes ? acc : el;
  }, {});
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
