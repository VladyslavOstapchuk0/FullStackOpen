import Header from './Header';
import Content from './Content';

const Course = ({ course }) => {
  return (
    <>
      <h2>Web development curriculum</h2>
      <Header name={course.name} />
      <Content parts={course.parts} />
    </>
  );
};

export default Course;
