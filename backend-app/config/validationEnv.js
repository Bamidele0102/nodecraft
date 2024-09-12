const Joi = require('joi');

const envSchema = Joi.object({
    MONGO_URI: Joi.string().required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required(),
}).unknown().required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = envVars;
