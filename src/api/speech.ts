import { gql, mutationStore } from '@urql/svelte';
import faunadb from '../lib/faunadb.js';
import type { ISpeech } from '../lib/types';

export const createSpeech = (data: ISpeech) => (
  mutationStore({
    client: faunadb,
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
    client: faunadb,
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
    client: faunadb,
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
