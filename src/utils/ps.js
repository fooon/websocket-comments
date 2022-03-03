export const ps = (count, forms) => {
  const lastNumber = count % 10;

  if (lastNumber === 1 && count !== 11) {
    return forms[0];
  } else if (!(count < 20 && count > 10) && lastNumber > 1 && lastNumber <= 4) {
    return forms[1];
  } else {
    return forms[2];
  }
}

export default ps;