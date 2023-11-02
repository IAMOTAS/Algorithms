function solution(operations) {
  const cardData = {}; // This object will store card data, with card holders as keys and their information as values.

  function isLuhnValid(cardNumber) {
    // Luhn algorithm implementation to check card validity
    const digits = cardNumber.split('').map(Number);

    let sum = 0;
    let double = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];

      if (double) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      double = !double;
    }

    return sum % 10 === 0;
  }

  function addCard(cardHolder, cardNumber, limit) {
    if (isLuhnValid(cardNumber)) {
      cardData[cardHolder] = {
        cardNumber,
        limit,
        balance: 0,
      };
    } else {
      cardData[cardHolder] = { error: true };
    }
  }

  function processCharge(cardHolder, amount) {
    if (cardData[cardHolder] && !cardData[cardHolder].error) {
      if (cardData[cardHolder].balance + amount <= cardData[cardHolder].limit) {
        cardData[cardHolder].balance += amount;
      }
    }
  }

  function processCredit(cardHolder, amount) {
    if (cardData[cardHolder] && !cardData[cardHolder].error) {
      cardData[cardHolder].balance -= amount;
    }
  }

  for (const operation of operations) {
    const [command, cardHolder, value] = operation.split(' ');

    if (command === 'Add') {
      const cardNumber = value.slice(1); // Remove the '$' sign
      const limit = parseInt(value.slice(1));
      addCard(cardHolder, cardNumber, limit);
    } else if (command === 'Charge') {
      const amount = parseInt(value.slice(1));
      processCharge(cardHolder, amount);
    } else if (command === 'Credit') {
      const amount = parseInt(value.slice(1));
      processCredit(cardHolder, amount);
    }
  }

  // Collect card holders in alphabetical order
  const cardHolders = Object.keys(cardData).filter((name) => !cardData[name].error).sort();
  const result = [];

  for (const cardHolder of cardHolders) {
    const balance = cardData[cardHolder].balance;
    result.push(`${cardHolder}: ${balance}`);
  }

  return result;
}
