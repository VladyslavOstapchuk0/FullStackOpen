import Part from './Part';
import Total from './Total';

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => {
        return (
          <Part key={part.id} part={part.name} exercises={part.exercises} />
        );
      })}
      <Total parts={parts} />
    </>
  );
};

export default Content;
