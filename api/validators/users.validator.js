const Joi = require("joi");

exports.userSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": `Name cant be empty`,
    "any.required": `Name is required field`,
  }),
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
    .required()
    .error((errors) => {
      errors.map((error) => {
        switch (error.code) {
          case "any.required":
            error.message = "email is requiered";
            break;
          case "string.pattern.base":
            error.message =
              "email must be in proper email format. e.g user1@gmail.com";
            break;
          case "string.empty":
            error.message = "email cant be empty";
            break;
        }
      });
      return errors;
    }),
  // .messages({
  //   "string.empty": `Email cant be empty`,
  //   "any.required": `Email is required field`,
  // }),
  password: Joi.string()
    .regex(/^.*(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/)
    .min(8)
    .max(20)
    .required()
    .error((errors) => {
      errors.map((error) => {
        switch (error.code) {
          case "string.min":
            error.message = "password min length must be 8";
            break;
          case "string.max":
            error.message = "password length must be 20";
            break;
          case "string.pattern.base":
            error.message =
              "password must contain at least one uppercase letter, one lowercase letter, one symbol and one number";
            break;
          case "any.empty":
            error.message = "password cant be empty";
            break;
        }
      });
      return errors;
    }),
});
