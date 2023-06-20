import { useState } from 'react';
import styles from './Settings.module.css';

function Settings({ setSpeed, setTestMessages }) {
  const handleFontChange = (value) => {
    var baseFontSize;
    switch (value) {
      case 0:
        baseFontSize = 16;
        break;
      case 1:
        baseFontSize = 18;
        break;
      case 3:
        baseFontSize = 22;
        break;
      case 4:
        baseFontSize = 24;
        break;
      default:
        baseFontSize = 20;
        break;
    }
    document.documentElement.style.setProperty(
      '--base-fontSize',
      `${baseFontSize}px`
    );
  };

  const handleOpacityChange = (value) => {
    var baseOpacity;
    switch (value) {
      case 0:
        baseOpacity = 0.2;
        break;
      case 1:
        baseOpacity = 0.4;
        break;
      case 2:
        baseOpacity = 0.6;
        break;
      case 3:
        baseOpacity = 0.8;
        break;
      default:
        baseOpacity = 1;
        break;
    }
    document.documentElement.style.setProperty(
      '--base-opacity',
      `${baseOpacity}`
    );
  };

  const handleSpeedChange = (value) => {
    var time;
    switch (value) {
      case 0:
        time = 28;
        break;
      case 1:
        time = 24;
        break;
      case 3:
        time = 16;
        break;
      case 4:
        time = 12;
        break;
      default:
        time = 20;
        break;
    }
    document.documentElement.style.setProperty('--base-speed', `${time}s`);
    setSpeed(value);
  };

  const handleTestChange = (value) => {
    setTestMessages(value);
  };

  return (
    <div className={styles.settingsPanel}>
      <div className={styles.settingsScrollContainer}>
        <div className={styles.horizontalFlex}>
          <h1>Bullet chat settings</h1>
        </div>
        <div className={styles.settingsControls}>
          <Slider
            onChange={handleFontChange}
            sliderId={'fontSize'}
            name={'Font size'}
            min={0}
            max={4}
            minName={'Small'}
            maxName={'Large'}
            defaultValue={2}
          ></Slider>
          <Slider
            onChange={handleOpacityChange}
            sliderId={'opacity'}
            name={'Opacity'}
            min={0}
            max={4}
            minName={'Low'}
            maxName={'High'}
            defaultValue={4}
          ></Slider>
          <Slider
            onChange={handleSpeedChange}
            sliderId={'scrollSpeed'}
            name={'Scroll speed'}
            min={0}
            max={4}
            minName={'Slow'}
            maxName={'Fast'}
            defaultValue={2}
          ></Slider>
        </div>
        <Toggle name={'Show test messages'} onChange={handleTestChange} />
      </div>
    </div>
  );
}

function Slider({
  sliderId,
  name,
  min,
  max,
  minName,
  maxName,
  onChange,
  defaultValue,
}) {
  const [value, setValue] = useState(defaultValue || 2);

  const handleChange = (e) => {
    const val = Number(e.target.value);
    setValue(val);
    onChange(val);
  };

  return (
    <div className={styles.sliderWidth}>
      <label className={styles.settingName} htmlFor={sliderId}>
        {name}
      </label>
      <input
        type='range'
        className={styles.rangeSlider}
        id={sliderId}
        name={name}
        min={min}
        max={max}
        step={1}
        onChange={handleChange}
        value={value}
      />
      <div className={styles.tickmarks}>
        <div
          className={`${styles.dot} ${styles.bigger} ${styles.biggerMin}`}
        ></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div
          className={`${styles.dot} ${styles.bigger} ${styles.biggerMax}`}
        ></div>
      </div>
      <div className={styles.sliderSublabels}>
        <p>{minName}</p>
        <p>{maxName}</p>
      </div>
    </div>
  );
}

function Toggle({ name, onChange }) {
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    const val = checked;
    setChecked(!val);
    onChange(!val);
  };

  return (
    <div className={styles.toggleContainer}>
      <p className={styles.settingName}>{name}</p>
      <label className={styles.switch}>
        <input type='checkbox' checked={checked} onChange={handleChange} />
        <span className={`${styles.sliderRound} ${styles.slider}`}></span>
      </label>
    </div>
  );
}

export default Settings;
