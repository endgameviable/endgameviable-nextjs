import { standardPageComponent } from '@/site/standardPageView';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';

// Configuration for Amplify hosting so we can get credentials, I hope?
// Depends on aws-exports.js file which is generated by, I think, `amplify env checkout (env)`
// I didn't want to couple the application with AWS Amplify like this,
// but it seems I have no choice if I don't want to embed access tokens
// for the server-side runtime environment.
Amplify.configure(awsconfig);

export default async function Home() {
  return standardPageComponent([]);
}
