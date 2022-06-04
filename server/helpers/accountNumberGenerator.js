const accountNumberGenerator = () => {
  return new Promise(resolve => {
    const date = new Date();
    const now =
      date.getSeconds().toString() +
      date.getDate().toString() +
      date.getDay().toString() +
      date.getFullYear().toString();
    const randomNumber = Math.floor(
      Math.random() * (999 - 111 + 1) + 111
    ).toString();
    const accountNumber = +(now + randomNumber);
    console.log(accountNumber);
    resolve(accountNumber);
  });
};

module.exports = { accountNumberGenerator };
