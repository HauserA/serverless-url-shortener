// Import all functions from put-item.js
const dynamodb = require('aws-sdk/clients/dynamodb');
const lambda = require('../../../src/handlers/put-item.js');
// Import dynamodb from aws-sdk

// This includes all tests for putItemHandler()
describe('Test putItemHandler', () => {
  let putSpy;

  // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown
  beforeAll(() => {
    // Mock dynamodb get and put methods
    // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname
    putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
  });

  // Clean up mocks
  afterAll(() => {
    putSpy.mockRestore();
  });

  // This test invokes putItemHandler() and compare the result
  it('should add id to the table', async () => {
    const returnedItem = { id: 'id1', url: 'https://google.de' };

    // Return the specified value whenever the spied put function is called
    putSpy.mockReturnValue({
      promise: () => Promise.resolve(returnedItem),
    });

    const event = {
      requestContext: {
        http: {
          method: 'POST',
        },
      },
      body: '{"id": "id1","url": "https://google.de", "password": "secretpassword"}',
    };

    // Invoke putItemHandler()
    const result = await lambda.putItemHandler(event);
    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(returnedItem),
    };

    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
