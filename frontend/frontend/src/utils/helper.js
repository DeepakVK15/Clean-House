export const convertSingleToDoubleDigit = (num) => {
  if (num < 10) {
    return `0${num}`;
  }

  return `${num}`;
};

export const isAdmin = (email) => {
  if (email) {
    const emailParts = email.trim().split("@");
    const domain = emailParts[emailParts.length - 1];

    return domain.toLowerCase() === "sjsu.edu";
  }

  return false;
};
