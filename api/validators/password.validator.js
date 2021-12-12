const Joi = require("joi");

exports.passwordSchema = Joi.object({
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
