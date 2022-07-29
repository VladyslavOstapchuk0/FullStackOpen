import ShowCountry from './ShowCountry';

const ShowCountries = ({ countries }) => {
  console.log(countries);
  if (countries.length > 10 && countries.length > 0) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length <= 10 && countries.length > 1) {
    return countries.map((country) => {
      return <p key={country.name.common}>{country.name.common}</p>;
    });
  } else if (countries.length === 1) {
    return <ShowCountry country={countries} />;
  }
};

export default ShowCountries;
