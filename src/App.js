import './App.css';
import { useEffect, useState } from 'react';
import Chat, { useIVSChat } from './components/Chat';
import Composer from './components/Composer';
import VideoPlayer from './components/VideoPlayer';
import Settings from './components/Settings';
import SignIn from './components/SignIn';
import Error from './components/Error';

function App() {
  // showSignIn represents whether the sign in modal
  // should be visible or not.
  const [showSignIn, setShowSignIn] = useState(true);
  const { messages, sendMessage, requestChatToken, sendTestMessage } =
    useIVSChat(errorHandler, clearError);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(false);

  const [speed, setSpeed] = useState(2);
  const [testMessages, setTestMessages] = useState(false);

  const handleSignIn = (username, avatar) => {
    // Request a token from the server
    requestChatToken(username, avatar)
      .then(() => {
        setShowSignIn(false);
      })
      .catch((err) => {
        console.error('Error requesting chat token:', err);
      });
  };

  const toggleSettings = () => {
    if (showSettings) {
      setShowSettings(false);
    } else {
      setShowSettings(true);
    }
  };

  function errorHandler(message) {
    setError(message);
  }

  function clearError() {
    setError(false);
  }

  useEffect(() => {
    var interval;
    if (testMessages) {
      interval = setInterval(() => {
        sendTestMessage();
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testMessages, sendTestMessage]);

  return (
    <div className='App'>
      {error ? <Error message={error} /> : <></>}

      <div id='vid-container'>
        <div
          className={
            showSettings
              ? 'fadeIn constantSettings'
              : 'fadeOut constantSettings'
          }
        >
          <img
            className='cancelIcon'
            src='/images/simple-close-button.svg'
            onClick={toggleSettings}
            alt='x-mark icon'
          />
          <Settings setSpeed={setSpeed} setTestMessages={setTestMessages} />
        </div>
        <button className='settingsButton' onClick={toggleSettings}>
          <img
            className={
              showSettings ? 'settingsIcon settingsIconActive' : 'settingsIcon'
            }
            src='images/settings-icon.svg'
            alt='Settings cog icon'
          />
        </button>
        <Chat messages={messages} speedModifier={speed} className='zIndex' />
        <VideoPlayer playbackUrl='https://4c62a87c1810.us-west-2.playback.live-video.net/api/video/v1/us-west-2.049054135175.channel.HPz5Ug1fjNTO.m3u8' />
      </div>
      <div className='composer'>
        <Composer handleMessageSend={sendMessage} />
      </div>

      <SignIn handleSignIn={handleSignIn} showSignIn={showSignIn} />
    </div>
  );
}

export default App;
