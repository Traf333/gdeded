import { scenariosQuery } from '../api/scenario';
import client from '../lib/faunadb';

export const prerender = true
export const load = async () => {
  const response = await client.query(scenariosQuery, {}).toPromise();
  return { scenarios: response.data.allScenarios.data };
};
