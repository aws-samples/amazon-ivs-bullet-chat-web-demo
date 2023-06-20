import styles from './Chat.module.css';
import ChatMessage from './ChatMessage';

const LINES = 5;

function Chat({ messages, speedModifier }) {
  let chatLines = [];
  for (let i = 0; i < LINES; i++) {
    let messagesToShow = messages.map((message) => {
      const belongsInCurrentLine = message.line === i;
      if (!belongsInCurrentLine) return null;
      return (
        <ChatMessage
          key={message.id}
          content={message.content}
          sender={message.sender}
          line={message.line}
          special={message.special}
          speed={message.speed}
          isEmoji={message.isEmoji}
          speedModifier={speedModifier}
        />
      );
    });
    chatLines.push(
      <div key={`LINE_NUMBER-${i}`} className={styles.row}>
        {messagesToShow}
      </div>
    );
  }
  return <div className={styles.chatContainer}>{chatLines}</div>;
}

export default Chat;
