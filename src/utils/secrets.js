const SSM = require('aws-sdk/clients/ssm');

const ssm = new SSM({ region: 'eu-central-1' });

exports.getSecret = async (name) => {
  const param = await ssm.getParameter(
    {
      Name: `/${name}`,
      WithDecryption: true,
    },
  ).promise();
  return param.Parameter.Value;
};
