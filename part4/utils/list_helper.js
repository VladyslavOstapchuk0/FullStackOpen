const dummy = (blogs) => {
  console.log(blogs);
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
