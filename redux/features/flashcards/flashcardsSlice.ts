/* eslint-disable no-param-reassign */
import {
  createSlice,
  createSelector,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

export interface FlashcardState {
  id: string;
  question: string;
  answer: string;
  completed: boolean;
}

interface FlashcardMetadataState {
  id: string;
  completed: boolean;
}

// Generic type pertains to the Entity
const flashcardsAdapter = createEntityAdapter<FlashcardMetadataState>();

export const flashCardsSlice = createSlice({
  name: 'flashcards',
  initialState: flashcardsAdapter.getInitialState({
    currentFlashcardIndex: 0,
  }),
  reducers: {
    flashcardCompleted(state, action: PayloadAction<{ flashcardId: string }>) {
      const { flashcardId } = action.payload;
      const flashcard = state.entities[flashcardId];

      if (flashcard) {
        flashcard.completed = true;

        if (state.currentFlashcardIndex === state.ids.length - 1) {
          // Reassign currentFlashcardIndex with index of first skipped flashcard
          state.currentFlashcardIndex = Object
            .values(state.entities)
            .findIndex((flashcardEntity) => !flashcardEntity?.completed);
        } else {
          state.currentFlashcardIndex += 1;
        }
      }
    },
    flashcardSkipped(state) {
      if (state.currentFlashcardIndex === state.ids.length - 1) {
        state.currentFlashcardIndex = Object
          .values(state.entities)
          .findIndex((flashcardEntity) => !flashcardEntity?.completed);
      } else {
        state.currentFlashcardIndex += 1;
      }
    },
    flashcardsReset(state) {
      Object
        .values(state.entities)
        .forEach((flashcardEntity) => {
          if (flashcardEntity) {
            flashcardEntity.completed = false;
          }
        });

      state.currentFlashcardIndex = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(apiSlice.endpoints.getFlashcards.matchFulfilled, (state, action) => {
      const flashcardsMetadata = action.payload.map((flashcard) => ({
        id: flashcard.id,
        completed: false,
      }));

      flashcardsAdapter.upsertMany(state, flashcardsMetadata);
    });
  },
});

export const {
  flashcardCompleted,
  flashcardSkipped,
  flashcardsReset,
} = flashCardsSlice.actions;

// Get flashcards from cache
const selectFlashcardsResult = apiSlice.endpoints.getFlashcards.select();

export const selectFlashcards = createSelector(
  // Input selector function
  selectFlashcardsResult,
  // Output selector function with input selector function return value as args
  (flashcardsResult) => flashcardsResult?.data ?? [],
);

export default flashCardsSlice.reducer;
