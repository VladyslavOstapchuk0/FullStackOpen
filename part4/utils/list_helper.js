const dummy = (blogs) => {
  console.log(blogs);
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, el) => {
    return (sum += el.likes);
  }, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
