const ShowCountry = ({ country }) => {
  return (
    <div>
      <h2>{country[0].name.common}</h2>

      <p>capital {country[0].capital[0]}</p>
      <p>area {country[0].area}</p>
      <b>
        <p>languages:</p>
      </b>
      <ul>
        {Object.values(country[0].languages).map((val) => {
          return <li key={val}>{val}</li>;
        })}
      </ul>
      <img
        src={country[0].flags.png}
        alt={`flag of ${country[0].name.common}`}
      />
    </div>
  );
};

export default ShowCountry;
