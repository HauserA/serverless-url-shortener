
const fs = require('fs');

/**
 * Serve the index.html file to create new routes
 */
exports.getIndexHandler = async (event) => {
    if (event.requestContext.http.method !== 'GET') {
        throw new Error(`getIndex only accept GET method, you tried: ${event.requestContext.http.method}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Return index page
    const response = {
        statusCode: 200,
        body: fs.readFileSync('./src/public/index.html', 'utf8'),
        headers: {
            'Content-Type': 'text/html',
        }
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
