const mongoose = require('mongoose');

const url = process.env.MONGODB_URI.replace(
  '<password>',
  process.env.MONGODB_PASSWORD
);

console.log('connecting to', url);

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function check(str) {
        if (str.length < 8) return false;
        const s = str.split('-');
        if (
          (s[0].length === 3 || s[0].length === 2) &&
          s[0].match(/^[0-9]+$/) != null
        ) {
          if (s[1].match(/^[0-9]+$/) != null) {
            return true;
          } else return false;
        } else return false;
      },
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
