import { gql, mutationStore, queryStore } from '@urql/svelte';
import client from '$lib/database/client.js';
import type { IScenario } from '../lib/types';

export const fetchScenarios = () => (
  queryStore({
    client: client,
    query: gql`
        query {
            allScenarios {
                data {
                    title
                    _id
                    roles
                    description
                }
            }
        }
    `,
  })
);

export const createScenario = (data: IScenario) => (
  mutationStore({
    client: client,
    query: gql`
        mutation createScenario($data: ScenarioInput!){
            createScenario(data: $data) {
                title
                _id
                roles
                description
            }
        }
    `,
    variables: { data }
  })
);
