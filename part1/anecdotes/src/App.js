import { useState } from 'react';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0));
  const [mostVotes, setMostVotes] = useState(0);

  const handleClickNext = () => {
    let random = Math.floor(Math.random() * (anecdotes.length - 0) + 0);
    setSelected(random);
  };

  const handleClickVote = () => {
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);

    const max = copy.reduce(function (a, b) {
      return Math.max(a, b);
    }, -Infinity);
    const index = copy.indexOf(max);
    setMostVotes(index);
  };

  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <div>has {points[selected]} votes</div>
      <button onClick={() => handleClickVote()}>vote</button>
      <button onClick={() => handleClickNext()}>next anecdote</button>
      <h2>Anecdote with the most votes</h2>
      {anecdotes[mostVotes]}
      <div>has {points[mostVotes]} votes</div>
    </div>
  );
};

export default App;
