import styles from './VideoPlayer.module.css';
import * as config from '../../config.js';
import { useEffect, useRef } from 'react';

function VideoPlayer() {
  const videoRef = useRef();

  const mediaPlayerScriptLoaded = () => {
    const MediaPlayerPackage = window.IVSPlayer;

    // First, check if the browser supports the Amazon IVS player.
    if (!MediaPlayerPackage.isPlayerSupported) {
      console.warn(
        'The current browser does not support the Amazon IVS player.'
      );
      return;
    }

    // Initialize player
    const player = MediaPlayerPackage.create();
    player.attachHTMLVideoElement(videoRef.current);

    // Setup stream and play
    player.setAutoplay(true);
    player.load(config.PLAYBACK_URL);
  };

  useEffect(() => {
    if (window.IVSPlayer) {
      mediaPlayerScriptLoaded();
    }
  }, []);

  return (
    <div className='player-wrapper'>
      <div className='aspect-169 pos-relative full-width full-height'>
        <video
          ref={videoRef}
          id='video-player'
          className={`${styles.videoBackground} video-elem pos-absolute full-width`}
          playsInline
          muted
        ></video>
      </div>
    </div>
  );
}

export default VideoPlayer;
