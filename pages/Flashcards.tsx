import React, { useState } from 'react';
import Flashcard from '../components/Flashcard';
import {
  flashcardCompleted,
  flashcardSkipped,
  flashcardsReset,
} from '../redux/features/flashcards/flashcardsSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useGetFlashcardsQuery } from '../redux/features/api/apiSlice';
import styles from '../styles/Flashcards.module.scss';

export default function Flashcards() {
  const dispatch = useAppDispatch();
  const currentFlashcardIndex = useAppSelector((state) => state.flashcards.currentFlashcardIndex);

  const [isFlipped, setIsFlipped] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);

  const { data: flashcards = [], isLoading } = useGetFlashcardsQuery();

  if (isLoading) return null;

  const currentFlashcard = flashcards[currentFlashcardIndex];

  const handleResetCard = () => { setIsFlipped(false); setHasFlipped(false); };
  const handleResetCards = () => dispatch(flashcardsReset());

  const handleComplete = () => {
    dispatch(flashcardCompleted({ flashcardId: currentFlashcard?.id || '' }));
    handleResetCard();
  };

  const handleSkip = () => {
    dispatch(flashcardSkipped());
    handleResetCard();
  };

  const handleFlip = () => {
    setIsFlipped((f) => !f);
    if (!hasFlipped) setHasFlipped(true);
  };

  return (
    <div className={styles.container}>
      {currentFlashcardIndex >= 0
        ? (
          <>
            <Flashcard
              {...currentFlashcard}
              isFlipped={isFlipped}
              handleFlip={handleFlip}
            />
            <p className={styles.text}>Click to flip the card</p>
            <div className={`${styles.buttonsContainer}${hasFlipped ? '' : ` ${styles.buttonsContainerVisibilityHidden}`}`}>
              <button
                type="button"
                className={styles.button}
                onClick={handleSkip}
              >
                Skip
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={handleComplete}
              >
                Got it
              </button>
            </div>
          </>
        )
        : (
          <>
            <img alt="Flashcards" src="images/flashcards.png" className={styles.flashcardsImage} />
            <p className={`${styles.text} ${styles.textFontWeightBold}`}>Well Done!</p>
            <p className={styles.text}>You just finished 7 flash cards.</p>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={handleResetCards}
            >
              Try Again?
            </button>
          </>
        )}
    </div>
  );
}
