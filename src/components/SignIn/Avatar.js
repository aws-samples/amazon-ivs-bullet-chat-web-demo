import styles from './Avatar.module.css';
import { useState } from 'react';
import { AVATARS } from '../../constants';
import Button from '../Button';

export default function Avatars({ onClick, defaultAvatar, disabled }) {
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar);

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
    onClick(avatar);
  };

  return (
    <>
      {AVATARS.map((avatar) => {
        const selected = avatar.name === selectedAvatar.name;
        return (
          <div key={avatar.name}>
            <Button
              className={
                selected
                  ? styles.selectedAvatarContainer
                  : styles.avatarContainer
              }
              onClick={(e) => {
                e.preventDefault();
                if (disabled) return;
                handleAvatarClick(avatar);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (disabled) return;
                  handleAvatarClick(avatar);
                }
              }}
              key={avatar.name}
              disabled={disabled}
            >
              <img
                className={selected ? styles.selectedAvatar : styles.avatar}
                src={avatar.src}
                alt={avatar.name}
                onClick={(e) => {
                  e.preventDefault();
                  if (disabled) return;
                  handleAvatarClick(avatar);
                }}
              />
              {selected && (
                <div className={styles.checkboxContainer}>
                  <svg
                    className={styles.checkboxIcon}
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    fill='white'
                    viewBox='0 0 24 24'
                  >
                    <path d='M9 16.67L4.83 12.5L3.41 13.91L9 19.5L21 7.49997L19.59 6.08997L9 16.67Z' />
                  </svg>
                </div>
              )}
            </Button>
          </div>
        );
      })}
    </>
  );
}
