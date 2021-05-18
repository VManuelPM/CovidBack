const router = require('express').Router();
const Covid = require('../model/Covid');
const {
  capitalizeFirstLetter,
  makeCountryLastDate,
} = require('../shared/words');
const { covidValidation } = require('../validation');
const verify = require('./verifyToken');
const countriesJson = require('../shared/countries.json');

/**
 * @swagger
 * components:
 *   schemas:
 *     Covid:
 *       type: object
 *       required:
 *         - country
 *         - continent
 *         - population
 *         - indicator
 *         - weekly_count
 *         - year_week
 *         - cumulative_count
 *         - source
 *       properties:
 *         country:
 *           type: string
 *           description: The name of the country
 *         country_code:
 *           type: string
 *           description: The country code of the country
 *         continent:
 *           type: string
 *           description: The name of the continent
 *         population:
 *           type: number
 *           description: Population of the country
 *         indicator:
 *           type: string
 *           description: indicator of the country
 *         weekly_count:
 *           type: number
 *           description: weekly_count
 *         year_week:
 *           type: string
 *           description: week of the year (year-week)
 *         rate_14_day:
 *           type: number
 *           description: rate_14_day
 *         cumulative_count:
 *           type: number
 *           description: cumulative_count
 *         source:
 *           type: string
 *           description: source of the information
 *       example:
 *         country: Spain,
 *         country_code: ESP,
 *         continent: Europe,
 *         population: 47332614,
 *         indicator: deaths,
 *         weekly_count: 555,
 *         rate_14_day: 25.1623542278903,
 *         cumulative_count: 78293,
 *         source: Epidemic intelligence, national weekly data
 */

/**
 * @swagger
 * tags:
 *  name: Covid
 *  description: Operations related with Covid Data
 */

/**
 * @swagger
 * /api/covid/data/all:
 *   get:
 *     summary: Returns the list of all countries with covid Data
 *     tags: [Covid]
 *     responses:
 *       200:
 *         description: The list of the countries
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Covid'
 *       401:
 *         description: Need header token
 */
router.get('/data/all', verify, async (req, res) => {
  try {
    const dataCovid = await Covid.find();
    res.status(200).json(dataCovid);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/covid/data/{idData}:
 *   get:
 *     summary: Returns the data of country with covid Data based on id
 *     tags: [Covid]
 *     parameters:
 *       - in: path
 *         name: idData
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of document
 *     responses:
 *        200:
 *         description: The list of the country
 *        401:
 *         description: Need header token
 *        400:
 *         description: Bad request
 */
router.get('/data/:idData', verify, async (req, res) => {
  try {
    let idParam = req.params.idData;
    if (idParam) {
      countryParam = capitalizeFirstLetter(idParam);
      const dataCovid = await Covid.find({ _id: idParam });
      res.status(200).json(dataCovid);
    } else {
      res.status(400).send('Bad request');
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/covid/data/country/{country}:
 *   get:
 *     summary: Returns the data of country with covid Data based on country
 *     tags: [Covid]
 *     parameters:
 *       - in: path
 *         name: country
 *         schema:
 *           type: string
 *         required: true
 *         description: The country of document
 *     responses:
 *        200:
 *         description: The list of the country
 *        401:
 *         description: Need header token
 *        400:
 *         description: Bad request
 */
router.get('/data/country/:country', verify, async (req, res) => {
  try {
    let countryParam = req.params.country;
    if (countryParam) {
      countryParam = capitalizeFirstLetter(countryParam);
      const dataCovid = await Covid.find({ country: countryParam });
      res.status(200).json(dataCovid);
    } else {
      res.status(400).send('Bad request');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/covid/data/continent/{continent}:
 *   get:
 *     summary: Returns the data of continent with covid Data based on continent
 *     tags: [Covid]
 *     parameters:
 *       - in: path
 *         name: continent
 *         schema:
 *           type: string
 *         required: true
 *         description: The continent of document
 *     responses:
 *        200:
 *         description: The list of the continent
 *        401:
 *         description: Need header token
 *        400:
 *         description: Bad request
 */
router.get('/data/continent/:continent', verify, async (req, res) => {
  try {
    let continentParam = req.params.continent;
    if (continentParam) {
      continentParam = capitalizeFirstLetter(continentParam);
      const dataCovid = await Covid.find({ continent: continentParam });
      res.status(200).json(dataCovid);
    } else {
      res.status(400).send('Bad request');
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/covid/data/get/continents:
 *   get:
 *     summary: Returns the continents with covid data based in the last date
 *     tags: [Covid]
 *     responses:
 *       200:
 *         description: The list of the continents
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Covid'
 *       401:
 *         description: Need header token
 */
router.get('/data/get/continents', verify, async (req, res) => {
  try {
    let asia, africa, europe, america, oceania;
    let asiaTotal, africaTotal, europeTotal, americaTotal, oceaniaTotal;
    let continentTotalObject;

    asia = 'Asia (total)';
    africa = 'Africa (total)';
    europe = 'Europe (total)';
    america = 'America (total)';
    oceania = 'Oceania (total)';

    asiaTotal = await findContinentTotal(asia);
    africaTotal = await findContinentTotal(africa);
    europeTotal = await findContinentTotal(europe);
    americaTotal = await findContinentTotal(america);
    oceaniaTotal = await findContinentTotal(oceania);

    continentTotalObject = {
      asiaTotal: asiaTotal,
      africaTotal: africaTotal,
      europeTotal: europeTotal,
      americaTotal: americaTotal,
      oceaniaTotal: oceaniaTotal,
    };
    console.log(continentTotalObject);
    res.status(200).json(continentTotalObject);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/covid/data/get/countries:
 *   get:
 *     summary: Returns the countries with covid data based in the last date
 *     tags: [Covid]
 *     responses:
 *       200:
 *         description: The list of the countries
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Covid'
 *       401:
 *         description: Need header token
 */
router.get('/data/get/countries', verify, async (req, res) => {
  try {
    let countries = countriesJson;
    let cases = {};
    let countryObjectData = [];

    for (element of countries) {
      cases = await findCountryTotal(element.country);
      countryObjectData.push(
        makeCountryLastDate(
          element.code,
          element.country,
          cases.cumulative_count
        )
      );
    }
    res.status(200).json(countryObjectData);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/covid/data/post:
 *   post:
 *     summary: Create a new data in collection
 *     tags: [Covid]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Covid'
 *     responses:
 *       200:
 *         description: The data was created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Covid'
 *       400:
 *          description: Error in form
 *       500:
 *         description: Some server error
 */
router.post('/data/post', verify, async (req, res) => {
  const { error } = covidValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let lastYearWeek = await findCountryByIndicator(
    req.body.country,
    req.body.indicator
  );

  let yearWeek = lastYearWeek.year_week.split('-');
  let year = yearWeek[0];
  let week = yearWeek[1];
  let dateFormed = '';

  if (Number.parseInt(week) > 52) {
    yearWeek = [];
    week = '0';
    year = (parseInt(year) + 1).toString();
  } else {
    yearWeek = [];
    week = (Number.parseInt(week) + 1).toString();
  }

  yearWeek.push(year);
  yearWeek.push('-');
  yearWeek.push(week);
  dateFormed = yearWeek.join('');

  console.log(yearWeek);
  console.log(dateFormed);

  const covid = new Covid({
    country: req.body.country,
    country_code: req.body.country_code,
    continent: req.body.continent,
    population: req.body.population,
    indicator: req.body.indicator,
    weekly_count: req.body.weekly_count,
    year_week: dateFormed,
    cumulative_count: req.body.cumulative_count,
    source: req.body.source,
  });

  try {
    const savedCovidData = await covid.save();
    res.send(savedCovidData);
    res.send(covid);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/**
 * @swagger
 * /api/covid/data/delete/{idData}:
 *   delete:
 *     summary: Delete the document based on id
 *     tags: [Covid]
 *     parameters:
 *       - in: path
 *         name: idData
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of document
 *     responses:
 *        200:
 *         description: The data removed
 *        401:
 *         description: Need header token
 *        400:
 *         description: Bad request
 */
router.delete('/data/delete/:idData', verify, async (req, res) => {
  try {
    const dataRemovedCovid = await Covid.remove({ _id: req.params.idData });
    res.status(200).json(dataRemovedCovid);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/covid/data/update/{idData}:
 *   patch:
 *     summary: Update the weeklt_count document based on id
 *     tags: [Covid]
 *     parameters:
 *       - in: path
 *         name: idData
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of document
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            {"weekly_count": 1050}
 *     responses:
 *        200:
 *         description: The data updated
 *        401:
 *         description: Need header token
 *        400:
 *         description: Bad request
 */
router.patch('/data/update/:idData', verify, async (req, res) => {
  try {
    const dataUpdatedCovid = await Covid.updateOne(
      { _id: req.params.idData },
      {
        $set: {
          weekly_count: req.body.weekly_count,
        },
      }
    );
    res.status(200).json(dataUpdatedCovid);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

/**
 * Find Total cases of continents
 * @param {*} continent
 * @returns Total of continent
 */
async function findContinentTotal(continent) {
  const continentData = await Covid.find({ country: continent })
    .sort({ year_week: -1 })
    .exec();
  let continentTotal = continentData[0];
  return continentTotal;
}

/**
 * Find Total cases of countries
 * @param {*} country
 * @returns Total of country
 */
async function findCountryTotal(country) {
  const countryData = await Covid.find({ country: country })
    .sort({ year_week: -1 })
    .exec();
  let continentTotal = countryData[0];
  return continentTotal;
}

/**
 * Get Last data from country depends indicator
 * @param {*} country Country
 * @param {*} indicator cases or death
 * @returns Last data of country depends indicator
 */
async function findCountryByIndicator(country, indicator) {
  const countryData = await Covid.find({
    country: country,
    indicator: indicator,
  })
    .sort({ year_week: -1 })
    .exec();
  let countryTotal = countryData[0];
  return countryTotal;
}

module.exports = router;
