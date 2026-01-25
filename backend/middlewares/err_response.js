import ErrHandler from "./err_handler.js";

const errResponse = (err, req, res, next) => {
  err.status = err.status || 500;
  err.msg = err.message || "Internal Server Error";

  // Type error
  // if (err.name === "TypeError") {
  //   // regular expression for err.stack which looks for single-quoted string.
  //   const propertyName =
  //     (err.stack.match(/'(.+?)'/) || [])[1] || "an undefined property found";

  //   const message = `Cannot read properties of undefined: ${propertyName}`;
  //   err = new ErrHandler(400, message);
  // }

  // Wrong mongodb objectId error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrHandler(400, message);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `${Object.keys(err.keyValue)} is already exist!`;
    err = new ErrHandler(400, message);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrHandler(400, message);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrHandler(400, message);
  }

  res.status(err.status).send({
    msg: err.message,
  });
};
export default errResponse;
