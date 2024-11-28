import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  STRIPE_SECRET_KEY: string;
  STRIPE_URL_SUCCESSFUL_PAYMENT: string;
  STRIPE_URL_CANCEL_PAYMENT: string;
  STRIPE_ENDPOINT_SECRET_KEY: string;
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_URL_SUCCESSFUL_PAYMENT: joi.string().required(),
    STRIPE_URL_CANCEL_PAYMENT: joi.string().required(),
    STRIPE_ENDPOINT_SECRET_KEY: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

console.log({ value });
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const env = {
  PORT: envVars.PORT,
  STRIPE_SECRET_KEY: envVars.STRIPE_SECRET_KEY,
  STRIPE_URL_SUCCESSFUL_PAYMENT: envVars.STRIPE_URL_SUCCESSFUL_PAYMENT,
  STRIPE_URL_CANCEL_PAYMENT: envVars.STRIPE_URL_CANCEL_PAYMENT,
  STRIPE_ENDPOINT_SECRET_KEY: envVars.STRIPE_ENDPOINT_SECRET_KEY,
};
