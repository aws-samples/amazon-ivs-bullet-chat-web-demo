import styles from './Composer.module.css';
import { useState, useEffect, useRef } from 'react';
import TextInput from '../Input';
import Button from '../Button';

function Composer({ handleMessageSend }) {
  const [message, setMessage] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [special, setSpecial] = useState(false);
  const [emojiHovering, setEmojiHovering] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState('🎉');
  const [intervalReference, setintervalReference] = useState(false);

  const [emojiNumber, setEmojiNumber] = useState(1);

  const [composerError, setComposerError] = useState(false);

  const [ShowFirstBubble, setShowFirstBubble] = useState(false);
  const [ShowSecondBubble, setShowSecondBubble] = useState(false);

  const clearInput = useRef(null);

  // WINDOW RESIZING
  const [isDesktop, setDesktop] = useState(window.innerWidth > 650);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 500);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  const handleSendClick = (e) => {
    e.preventDefault();
    handleMessageSend(message, special);
    clearInput.current && clearInput.current();
    setMessage('');
    setSubmitDisabled(true);
    setComposerError(false);
  };

  const handleMessageChange = (text) => {
    setMessage(text);
    if (text === '') {
      setSubmitDisabled(true);
    } else {
      setSubmitDisabled(false);
      if (text.length >= 40) {
        setComposerError(true);
      } else {
        setComposerError(false);
      }
    }
  };

  const emojisArray = ['🎉', '🥳', '👏', '🥹', '🤯', '💯', '✨', '🤩'];
  var i = 0;

  const goToNextEmoji = () => {
    if (emojiNumber < emojisArray.length - 1) {
      setEmojiNumber(emojiNumber + 1);
    } else {
      setEmojiNumber(0);
    }
    setCurrentEmoji(emojisArray[emojiNumber]);
  };

  useEffect(() => {
    // EMOJI BUTTON
    const emojisArray = ['🎉', '🥳', '👏', '🥹', '🤯', '💯', '✨', '🤩'];

    // Execute this code
    if (emojiHovering) {
      // If emojiHovering is true, cycle through emojis
      const interval = setInterval(() => {
        if (i < emojisArray.length - 1) {
          i = i + 1;
        } else {
          i = 0;
        }
        setCurrentEmoji(emojisArray[i]);
      }, 100);
      setintervalReference(interval);
    } else {
      // If emojiHovering is false, stop cycling through emojis
      if (intervalReference) {
        clearInterval(intervalReference);
      }
    }

    return () => {
      if (intervalReference) {
        clearInterval(intervalReference);
      }
    };
  }, [emojiHovering]);

  function ComposerError(props) {
    return (
      <div className={styles.errorMessageWrapper}>
        <img
          src='images/warning-icon.svg'
          className={styles.composerErrorIcon}
          alt='Warning icon'
        />
        <p className={styles.composerErrorText}>{props.message}</p>
      </div>
    );
  }

  function handleEmojiClick() {
    // use handleMessageSend and currentEmoji to send the current emoji to the chat room
    const isEmoji = true;
    handleMessageSend(currentEmoji, special, isEmoji);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleMessageSend(message, special);
      clearInput.current && clearInput.current();
      setSubmitDisabled(true);
      setComposerError(false);
    }
  }

  // BW & SPECIAL BUTTON
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Button
          className={
            special
              ? `${styles.emojiButton} ${styles.specialEmojiButton}`
              : styles.emojiButton
          }
          onMouseEnter={() => {
            setShowFirstBubble(true);
            setEmojiHovering(true);
          }}
          onMouseLeave={() => {
            setShowFirstBubble(false);
            setEmojiHovering(false);
          }}
          onTouchStart={() => {
            handleEmojiClick();
            goToNextEmoji();
          }}
          onTouchEnd={(e) => e.preventDefault()}
          onClick={handleEmojiClick}
          id='emojiButton'
        >
          {currentEmoji}
        </Button>

        <div className={styles.composerInput}>
          <TextInput
            error={composerError}
            type='text'
            additionalClassNames={
              special
                ? `${styles.input} ${styles.specialInput}`
                : `${styles.input}`
            }
            id='input'
            placeholder={
              isDesktop ? 'Send a bullet chat message' : 'Send a message'
            }
            onChange={handleMessageChange}
            maxLength={40}
            onKeyDown={handleKeyDown}
            clearInput={clearInput}
          ></TextInput>

          <div className={styles.styleButtonsWrapper}>
            <Button
              className={
                special
                  ? `${styles.formatButtonContainer} ${styles.tinyButton}`
                  : `${styles.formatButtonContainer}`
              }
              onClick={() => setSpecial(true)}
              onMouseEnter={() => {
                setShowSecondBubble(true);
              }}
              onMouseLeave={() => {
                setShowSecondBubble(false);
              }}
            >
              <img id='bwButton' src='images/sized-bw-button.svg' alt='TO DO' />
            </Button>
            <Button
              className={
                special
                  ? `${styles.formatButtonContainer}`
                  : `${styles.formatButtonContainer} ${styles.tinyButton}`
              }
              onClick={() => setSpecial(false)}
              onMouseEnter={() => {
                setShowSecondBubble(true);
              }}
              onMouseLeave={() => {
                setShowSecondBubble(false);
              }}
            >
              <img src='images/size-special-button.svg' alt='TO DO' />
            </Button>
          </div>
        </div>

        <Button
          additionalClassNames={styles.sendButton}
          onClick={handleSendClick}
          disabled={submitDisabled}
        >
          <img
            className={styles.sendIcon}
            alt='airplane icon'
            src='images/send-icon.svg'
          />
        </Button>
      </div>
      <div>
        {composerError ? (
          <ComposerError message='Your message cannot be any longer' />
        ) : (
          <></>
        )}
      </div>

      <div className={styles.speechBubbleRowContainer}>
        <div
          className={
            ShowFirstBubble
              ? `${styles.speechBubble} ${styles.first}  ${styles.speechBubbleAnimation}`
              : `${styles.speechBubble} ${styles.first} ${styles.hideOpacity}`
          }
        >
          Click to send an emoji in bullet chat
        </div>
        <div
          className={
            ShowSecondBubble
              ? `${styles.speechBubble} ${styles.second}  ${styles.speechBubbleAnimation}`
              : `${styles.speechBubble} ${styles.second} ${styles.hideOpacity}`
          }
        >
          Switch between normal and special messages
        </div>
      </div>
    </div>
  );
}

export default Composer;
