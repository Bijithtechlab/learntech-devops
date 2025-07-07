import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_5bmOBtUaw',
      userPoolClientId: '3t3qb2mff70p5m2rob38pbuss8',
    },
  },
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;