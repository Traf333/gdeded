import { gql, queryStore } from '@urql/svelte';
import client from '$lib/database/client.js';

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
