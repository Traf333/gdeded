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
                    active
                    speeches {
                        data {
                            text
                        }
                    }
                }
            }
        }
    `,
  })
);
export const fetchScenario = (id: string) => (
  queryStore({
    client: client,
    query: gql`
        query findScenarioByID($id: ID!) {
            findScenarioByID(id: $id) {
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
    `,
    variables: { id }
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

export const updateScenario = (id: string, data: IScenario) => (
  mutationStore({
    client: client,
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
    client: client,
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
