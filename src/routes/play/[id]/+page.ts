import { scenarioShowQuery } from '../../../api/scenario';
import client from '../../../lib/faunadb';

export const prerender = true

export const load = async ({ params }) => {
  const response = await client.query(scenarioShowQuery, { id: params.id }).toPromise();
  const { speeches: sp, ...rest } = response.data.findScenarioByID;
  const play = rest;
  const speeches = sp.data;
  return { play, speeches };
};
