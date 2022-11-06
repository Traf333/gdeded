import { allScenarios } from '../api/scenario';

export const prerender = true
export const load = async () => {
  const response = await allScenarios({});
  return { scenarios: response.data.allScenarios.data };
};
