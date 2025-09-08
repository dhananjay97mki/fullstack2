const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8 || password.length > 16) {
    return { isValid: false, message: 'Password must be between 8-16 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  return { isValid: true };
};

const validateUser = ({ name, email, password, address }) => {
  if (!name || name.length < 20 || name.length > 60) {
    return { isValid: false, message: 'Name must be between 20-60 characters' };
  }
  if (!email || !validateEmail(email)) {
    return { isValid: false, message: 'Valid email is required' };
  }
  if (address && address.length > 400) {
    return { isValid: false, message: 'Address must be less than 400 characters' };
  }
  if (password) {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return passwordValidation;
    }
  }
  return { isValid: true };
};

const validateStore = ({ name, email, address }) => {
  if (!name || name.length < 1) {
    return { isValid: false, message: 'Store name is required' };
  }
  if (!email || !validateEmail(email)) {
    return { isValid: false, message: 'Valid email is required' };
  }
  if (address && address.length > 400) {
    return { isValid: false, message: 'Address must be less than 400 characters' };
  }
  return { isValid: true };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUser,
  validateStore
};
