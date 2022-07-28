import { useState } from 'react';

const Button = ({ handleClick, text }) => {
  return (
    <div>
      <button onClick={handleClick}>{text}</button>
    </div>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  let all = good + neutral + bad;
  let average = all === 0 ? 0 : (good * 1 + neutral * 0 + bad * -1) / all;
  let positive = all === 0 ? 0 : (good / all) * 100;
  if (all === 0)
    return (
      <div>
        <h2>statistics</h2>
        <div>No feedback given</div>
      </div>
    );
  return (
    <div>
      <h2>statistics</h2>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {all}</p>
      <p>average {average}</p>
      <p>positive {positive} %</p>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const handleClickGood = () => {
    setGood(good + 1);
  };

  const handleClickNeutral = () => {
    setNeutral(neutral + 1);
  };

  const handleClickBad = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={() => handleClickGood()} text="good" />
      <Button handleClick={() => handleClickNeutral()} text="neutral" />
      <Button handleClick={() => handleClickBad()} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
