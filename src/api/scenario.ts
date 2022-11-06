import { gql, mutationStore, queryStore } from '@urql/svelte';
import faunadb from '../lib/faunadb.js';
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
export const fetchScenarios = () => (
  queryStore({
    client: faunadb,
    query: scenariosQuery,
  })
);

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

export const updateScenario = (id: string, data: IScenario) => (
  mutationStore({
    client: faunadb,
    query: gql`
        mutation updateScenario($id: ID!, $data: ScenarioInput!){
            updateScenario(id: $id, data: $data) {
                title
                _id
                roles
                description
            }
        }
    `,
    variables: { id, data }
  })
);

export const destroyScenario = (id: IScenario) => (
  mutationStore({
    client: faunadb,
    query: gql`
        mutation deleteScenario($id: ID!){
            deleteScenario(id: $id) {
                title
                _id
                roles
                description
            }
        }
    `,
    variables: { id }
  })
);
