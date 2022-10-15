import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FlashcardState } from '../flashcards/flashcardsSlice';
import { UserState, SigninArgs } from '../user/userSlice';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Flashcard', 'User'],
  endpoints: (builder) => ({
    // builder.query<ReturnType, ArgType>
    getFlashcards: builder.query<FlashcardState[], void>({
      query: () => '/flashcards',
      providesTags: (result = []) => [
        'Flashcard',
        ...result.map(({ id }) => ({ type: 'Flashcard' as const, id })),
      ],
      transformResponse: (response: { flashcards: FlashcardState[] }) => response.flashcards,
    }),
    signin: builder.mutation<UserState, SigninArgs>({
      query: (signinArgs) => ({
        url: '/signin',
        method: 'POST',
        // fetchBaseQuery automatically JSON-serializes the body
        body: { ...signinArgs },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetFlashcardsQuery, useSigninMutation } = apiSlice;
