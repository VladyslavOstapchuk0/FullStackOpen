const Total = ({ parts }) => {
  let total = 0;

  parts.map((part) => {
    return (total += part.exercises);
  });
  return <>Total of {total} exercises</>;
};

export default Total;
