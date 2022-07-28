const Total = ({ parts }) => {
  const total = parts.reduce((sum, cur) => {
    return (sum += cur.exercises);
  }, 0);

  return (
    <>
      <b>total of {total} exercises</b>
    </>
  );
};

export default Total;
