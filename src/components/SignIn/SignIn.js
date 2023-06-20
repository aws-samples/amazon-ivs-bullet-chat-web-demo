import TextInput from '../Input';
import { useState } from 'react';
import styles from './SignIn.module.css';
import Avatars from './Avatar';
import Button from '../Button';
import { DEFAULT_AVATAR } from '../../constants';

function Spinner() {
  return (
    <img
      src='/images/spinner.svg'
      alt='Loading spinner'
      className={styles.spinner}
    ></img>
  );
}

function SignIn({ handleSignIn, showSignIn }) {
  // Use state variables to keep track of user input
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Called when the username input is changed
  const handleUsernameChange = (name) => {
    setUsername(name);
    if (name === '') {
      setSubmitDisabled(true);
    } else {
      setSubmitDisabled(false);
    }
  };

  // Called when an avatar is clicked
  const handleAvatarClick = (avatar) => {
    setAvatar(avatar);
  };

  // Called when the "Join room" button is clicked
  const handleSubmit = () => {
    setSubmitDisabled(true);
    setSubmitted(true);
    handleSignIn(username, avatar);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  };

  return (
    <>
      {showSignIn ? (
        <div className={styles.signInOverlay}>
          <div className={styles.signInContainer}>
            <h1 className={styles.getStarted}>Get started</h1>
            <TextInput
              additionalClassNames={styles.nameInput}
              placeholder='Your name'
              onChange={handleUsernameChange}
              onKeyDown={handleKeyDown}
              disabled={submitted}
            />

            <div className={styles.avatarBox}>
              <p className={styles.avatarText}>Select avatar</p>
              <div className={styles.avatarFlexContainer}>
                <Avatars
                  onClick={handleAvatarClick}
                  defaultAvatar={avatar}
                  disabled={submitted}
                />
              </div>
            </div>
            <Button
              additionalClassNames={styles.joinButton}
              onClick={handleSubmit}
              disabled={submitDisabled}
            >
              {submitted ? (
                // Show Spinner Here
                <Spinner />
              ) : (
                'Join room'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default SignIn;
