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

exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.makeMessage = makeMessage;
