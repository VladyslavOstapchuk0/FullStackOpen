const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.wzl4l.mongodb.net/phonebook?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
  console.log('phonebook:');
  Person.find({})
    .then((persons) => {
      persons.forEach(({ name, number }) => {
        console.log(`${name} ${number}`);
      });
      mongoose.connection.close();
    })
    .catch((err) => console.log(err));
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person
    .save()
    .then(({ name, number }) => {
      console.log(`added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .finally(() => process.exit(1));
}

mongoose.connect(url).catch((err) => console.log(err));
