const Filter = ({ value, setFilter }) => {
  return (
    <div>
      filter shown with a:{' '}
      <input value={value} onChange={(e) => setFilter(e.target.value)} />
    </div>
  );
};

export default Filter;
