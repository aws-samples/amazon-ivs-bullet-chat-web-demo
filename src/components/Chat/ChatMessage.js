import styles from './ChatMessage.module.css';
import { motion } from 'framer-motion';

function ChatMessage({ content, special, isEmoji, speed, speedModifier }) {
  let durationArray = [28, 24, 20, 16, 12];
  let chosenDuration = durationArray[speedModifier];

  return (
    <motion.div
      className={
        special
          ? isEmoji
            ? `${styles.individualMessage} ${chosenDuration} ${styles.emojiSpecial}`
            : `${styles.special} ${styles.individualMessage}`
          : `${styles.individualMessage}`
      }
      initial={{
        marginLeft: '100%',
      }}
      animate={{
        marginLeft: '-100%',
        transitionEnd: {
          display: 'none',
        },
      }}
      transition={{
        duration: chosenDuration + 1 * speed,
        ease: 'linear',
      }}
    >
      {content}
    </motion.div>
  );
}

export default ChatMessage;
