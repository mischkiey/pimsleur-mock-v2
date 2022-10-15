import React from 'react';
import clsx from 'clsx';
import styles from '../styles/Flashcard.module.scss';

export interface FlashcardProps {
  question: string;
  answer: string;
  isFlipped: boolean;
  handleFlip: { (): void };
}

export default function Flashcard(props: FlashcardProps) {
  const {
    question,
    answer,
    isFlipped = false,
    handleFlip,
  } = props;

  return (
    <div className={styles.container}>
      <div
        className={clsx([styles.innerContainer, isFlipped && styles.innerContainerTransformRotate])}
      >
        <section className={styles.front}>
          <header className={styles.header}>
            <h3 className={styles.headerHeading}>RUS</h3>
          </header>
          <div className={styles.body}>
            <span className={styles.bodyText}>{question}</span>
          </div>
        </section>
        <section className={styles.back}>
          <header className={styles.header}>
            <h3 className={styles.headerHeading}>ENG</h3>
          </header>
          <div className={styles.body}>
            <p className={styles.bodyText}>{answer}</p>
          </div>
        </section>
        <button
          aria-label="Flip"
          type="button"
          className={styles.button}
          onClick={handleFlip}
        />
      </div>
    </div>
  );
}
