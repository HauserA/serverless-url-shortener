const Joi = require('joi');

const dynamodb = require('aws-sdk/clients/dynamodb');
const errors = require('../utils/errors');
const { itemSchema } = require('../utils/validation');
const { getSecret } = require('../utils/secrets');

// Create a DocumentClient that represents the query to add an item
const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

const domainName = process.env.DOMAIN_NAME;
const passwordParameter = process.env.PASSWORD_PARAMETER;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.putItemHandler = async (event) => {
  if (event.requestContext.http.method !== 'POST') {
    throw new Error(`putItem only accepts POST method, you tried: ${event.requestContext.http.method} method.`);
  }

  // Get id and url from the body of the request
  const body = JSON.parse(event.body);
  const id = body.id.toLowerCase();
  const url = body.url.toLowerCase();
  const { password } = body;
  delete body.password;

  // Check schema of post parameters
  try {
    Joi.assert({
      id,
      url,
      password,
    }, itemSchema);
  } catch (error) {
    return errors.InvalidSchema;
  }

  // Check if the password is the same as in SSM parameter store
  if (password !== await getSecret(passwordParameter)) {
    return errors.WrongPassword;
  }

  // Loops can cause problems
  if (url.includes(domainName)) {
    return errors.NoLoops;
  }

  const params = {
    TableName: tableName,
    Item: { id, url },
  };
  // eslint-disable-next-line no-unused-vars
  const result = await docClient.put(params).promise();

  // Return 200 if everything was ok
  const response = {
    statusCode: 200,
    body: JSON.stringify(body),
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
