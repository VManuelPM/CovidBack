function capitalizeFirstLetter(str) {
  // converting first letter to uppercase
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalized;
}

//make dto message
function makeMessage(title, message) {
  let messageObj = {
    title: title,
    message: message,
  };
  return messageObj;
}

function makeCountryLastDate(idCountry, namecountry, cases) {
  let countryObj = {
    id: idCountry,
    name: namecountry + ' ' + cases,
    fill: "am4core.color('#F05C5C')",
  };
  return countryObj;
}

exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.makeMessage = makeMessage;
exports.makeCountryLastDate = makeCountryLastDate;
