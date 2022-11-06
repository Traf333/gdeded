import { scenarioById } from '../../../api/scenario';

export const prerender = true;

export const load = async ({ params }) => {
  const response = await scenarioById(params.id);
  const { speeches: sp, ...rest } = response.data.findScenarioByID;
  const play = rest;
  const speeches = sp.data;
  return { play, speeches };
};
