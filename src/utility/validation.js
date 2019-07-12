export const validate = (rules, val1, val2) => {
  let valid = true;
  for(let rule in rules) {
    switch(rule) {
      case 'isEmail':
        valid = valid && validateEmail(val1);
        break;
      case 'minLength':
        valid = valid && checkMinLength(val1, rules[rule]);
        break;
      case 'equalTo':
        valid = valid && equalTo(val1, val2);
        break;
      case 'notEmpty': 
        valid = valid && notEmpty(val1);
        break;
    }
  }
  return valid;
}

const validateEmail = (email) => {
  return true;
}
const checkMinLength = (val, minLength) => {
  return val.length >= minLength;
}
const equalTo = (val1, val2) => {
  return val1 === val2;
}

const notEmpty = (value) => {
  return value.trim() !== '';
}