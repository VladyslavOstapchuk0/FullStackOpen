const ShowCountry = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>

      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <b>
        <p>languages:</p>
      </b>
      <ul>
        {Object.values(country.languages).map((val) => {
          return <li key={val}>{val}</li>;
        })}
      </ul>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`} />
    </div>
  );
};

export default ShowCountry;
