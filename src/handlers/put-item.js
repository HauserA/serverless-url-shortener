// Create clients and set shared const values outside of the handler.
const Joi = require('joi');

const errors = require('../utils/errors');
const {itemSchema} = require('../utils/validation');

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;
const domainName = process.env.DOMAIN_NAME;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.putItemHandler = async (event) => {
    if (event.requestContext.http.method !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.requestContext.http.method} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and url from the body of the request
    const body = JSON.parse(event.body)
    const id = body.id.toLowerCase();
    const url = body.url.toLowerCase();

    try {
        Joi.assert({
          id,
          url,
        }, itemSchema);
      } catch (error) {
        return errors.InvalidSchema;
    }

    if (url.includes(domainName)) {
        return errors.NoLoops;
    }

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    var params = {
        TableName : tableName,
        Item: { id : id, url: url }
    };

    const result = await docClient.put(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
