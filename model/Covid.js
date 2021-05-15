const mongoose = require('mongoose');

const covidSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      min: 10,
    },
    country_code: {
      type: String,
      required: false,
      min: 3,
    },
    continent: {
      type: String,
      required: true,
      min: 4,
    },
    population: {
      type: Number,
      required: true,
      min: 1,
    },
    indicator: {
      type: String,
      required: true,
      min: 5,
    },
    weekly_count: {
      type: Number,
      required: true,
    },
    year_week: {
      type: String,
      required: true,
    },
    rate_14_day: {
      type: Number,
      required: false,
    },
    cumulative_count: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      required: true,
      min: 10,
    },
  },
  { collection: 'data' }
);

module.exports = mongoose.model('Covid', covidSchema);
