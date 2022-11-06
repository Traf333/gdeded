import { gql, mutationStore, queryStore } from '@urql/svelte';
import faunadb, { client } from '../lib/faunadb.js';
import type { IScenario } from '../lib/types';

export const scenariosQuery = gql`
    query {
        allScenarios {
            data {
                title
                _id
                roles
                description
                active
                speeches {
                    data {
                        text
                    }
                }
            }
        }
    }
`;

export const scenarioShowQuery = gql`
    query findScenarioByID($id: ID!) {
        findScenarioByID(id: $id) {
            title
            _id
            roles
            description
            active
            speeches(_size: 10000) {
                data {
                    _id
                    text
                    audios
                }
            }
        }
    }
`;

export const createScenarioMutation = gql`
    mutation createScenario($data: ScenarioInput!){
        createScenario(data: $data) {
            title
            _id
            roles
            description
        }
    }
`;

export const updateScenarioMutation = gql`
    mutation updateScenario($id: ID!, $data: ScenarioInput!){
        updateScenario(id: $id, data: $data) {
            title
            _id
            roles
            description
        }
    }
`;

export const destroyScenarioMutation = gql`
    mutation deleteScenario($id: ID!){
        deleteScenario(id: $id) {
            title
            _id
            roles
            description
        }
    }
`;

export const allScenarios = (params: object) => client.query(scenariosQuery, params).toPromise();
export const scenarioById = (id: number) => client.query(scenarioShowQuery, { id }).toPromise();
export const create = (data: IScenario) => client.mutation(createScenarioMutation, { data }).toPromise();
export const update = (id: string, data: IScenario) => (
  client.mutation(updateScenarioMutation, { id, data }).toPromise()
);
export const destroy = (id: string) => client.mutation(destroyScenarioMutation, { id }).toPromise();

export const fetchScenarios = () => (
  queryStore({
    client: faunadb,
    query: scenariosQuery,
  })
);


export const fetchScenario = (id: string) => (
  queryStore({
    client: faunadb,
    query: scenarioShowQuery,
    variables: { id }
  })
);

export const createScenario = (data: IScenario) => (
  mutationStore({
    client: faunadb,
    query: createScenarioMutation,
    variables: { data }
  })
);

export const updateScenario = (id: string, data: IScenario) => (
  mutationStore({
    client: faunadb,
    query: updateScenarioMutation,
    variables: { id, data }
  })
);

export const destroyScenario = (id: IScenario) => (
  mutationStore({
    client: faunadb,
    query: destroyScenarioMutation,
    variables: { id }
  })
);
