// Import all functions from get-index.js
const lambda = require('../../../src/handlers/get-index.js');

// This includes all tests for getIndexHandler()
describe('Test getIndexHandler', () => {
  it('should return the index page', async () => {
    const event = {
      requestContext: {
        http: {
          method: 'GET',
        },
      },
    };

    // Invoke helloFromLambdaHandler()
    const result = await lambda.getIndexHandler(event);

    const expectedResult = {
      statusCode: 200,
      body: fs.readFileSync('../../../src/public/index.html', 'utf8'),
      headers: {
        'Content-Type': 'text/html',
      },
    };

    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
