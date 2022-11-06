import { gql, mutationStore, queryStore } from '@urql/svelte';
import client from '$lib/database/client.js';
import type { ISpeech } from '../lib/types';

export const fetchSpeeches = () => (
  queryStore({
    client: client,
    query: gql`
        query {
            findSpeechByID() {
                data {
                    text
                    }
                }
            }
        }
    `,
  })
);

export const createSpeech = (data: ISpeech) => (
  mutationStore({
    client: client,
    query: gql`
        mutation createSpeech($data: SpeechInput!){
            createSpeech(data: $data) {
                text
                _id
            }
        }
    `,
    variables: { data }
  })
);

export const updateSpeech = (id: string, data: ISpeech) => (
  mutationStore({
    client: client,
    query: gql`
        mutation updateSpeech($id: ID!, $data: SpeechInput!){
            updateSpeech(id: $id, data: $data) {
                text
                _id
            }
        }
    `,
    variables: { id, data }
  })
);

export const destroySpeech = (id: ISpeech) => (
  mutationStore({
    client: client,
    query: gql`
        mutation deleteSpeech($id: ID!){
            deleteSpeech(id: $id) {
                text
                _id
            }
        }
    `,
    variables: { id }
  })
);
