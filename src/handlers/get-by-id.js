const errors = require('../utils/errors');

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');

const docClient = new dynamodb.DocumentClient();

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
exports.getByIdHandler = async (event) => {
  if (event.requestContext.http.method !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.requestContext.http.method}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);

  // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
  const { id } = event.pathParameters;

  const params = {
    TableName: tableName,
    Key: { id },
  };
  const data = await docClient.get(params).promise();

  // If no url is found return 404 error page
  if (data.Item === undefined) {
    return errors.NotFound;
  }

  const { url } = data.Item;
  // redirect (301) to url
  const response = {
    statusCode: 301,
    headers: {
      Location: url,
    },
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
