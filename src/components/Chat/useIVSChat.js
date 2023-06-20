import { useState, useRef } from 'react';
import axios from 'axios';
import * as config from '../../config';

const LINES = 5;

export default function useIVSChat(errorHandler, clearError) {
  const [connection, setConnection] = useState([]);
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [errorTimer, setErrorTimer] = useState();
  const lineHistory = useRef([]);

  const sendMessage = (message, special, isEmoji) => {
    const data = {
      action: 'SEND_MESSAGE',
      content: `${message}`,
      attributes: {
        isSpecial: `${special}`,
        isEmoji: `${isEmoji}`,
      },
    };
    connection.send(JSON.stringify(data));
  };

  const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  };

  const sanitize = (string) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
      '`': '&grave;',
    };
    const reg = /[&<>"'/]/gi;
    return string.replace(reg, (match) => map[match]);
  };

  const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  };

  const getLineNumber = () => {
    // Build array of unselected values
    let unselected = [];
    for (let i = 0; i < LINES; i++) {
      if (!lineHistory.current.includes(i)) unselected.push(i);
    }
    const nextLine = unselected[Math.floor(Math.random() * unselected.length)];

    if (lineHistory.current.length > LINES / 2) {
      lineHistory.current = [...lineHistory.current.slice(1), nextLine];
    } else {
      lineHistory.current = [...lineHistory.current, nextLine];
    }

    return nextLine;
  };

  const handleMessage = (data) => {
    const sanitizedContent = sanitize(data['Content']);
    const lineNumber = getLineNumber();
    const isSpecial = data['Attributes']['isSpecial'];
    const isEmoji = data['Attributes']['isEmoji'];
    const messageSpeed = getRandomIntInclusive(0, 4);
    const newMessage = {
      id: data['Id'],
      content: sanitizedContent,
      sender: data['Sender'],
      line: lineNumber,
      special: isSpecial === 'true',
      speed: messageSpeed,
      isEmoji: isEmoji === 'true',
    };
    setMessages((prevState) => {
      if (prevState.length > 50) {
        prevState.shift();
      }
      return [...prevState, newMessage];
    });
  };

  const sendTestMessage = () => {
    const testMessages = [
      'Hello',
      'Testing',
      'Hi there!',
      'wow',
      'looks incredible',
      'this is so cool!',
      'lol',
      '🤩',
      '🥳',
      '👏',
      '🥹',
      '🤯',
    ];
    const testMessageIndex = getRandomIntInclusive(0, 11);
    const specialNum = getRandomIntInclusive(0, 2);
    const data = {
      Id: `${new Date().getTime()}-${testMessageIndex}`,
      Content: testMessages[testMessageIndex],
      Attributes: {
        isSpecial: specialNum === 1,
        isEmoji: testMessageIndex > 7,
      },
    };
    handleMessage(data);
  };

  const joinChatRoom = (token) => {
    const connectionInit = new WebSocket(
      `wss://edge.ivschat.${config.AWS_REGION}.amazonaws.com`,
      token
    );
    setConnection(connectionInit);

    connectionInit.onopen = (event) => {
      console.info('Connected to the chat room.');
    };

    connectionInit.onclose = (event) => {
      // If the websocket closes, remove the current chat token
      setToken(null);
    };

    connectionInit.onerror = (event) => {
      console.error('Chat room websocket error observed:', event);
    };

    connectionInit.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const eventType = data['Type'];

      switch (eventType) {
        case 'EVENT':
          // console.info("Received event:", data);
          // handleEvent(data);
          break;
        case 'ERROR':
          // console.info("Received error:", data);
          handleError(data);
          if (errorTimer) clearTimeout(errorTimer);
          const timeout = setTimeout(() => {
            clearError();
          }, 5000);
          setErrorTimer(timeout);
          break;
        case 'MESSAGE':
          // console.info("Received message:", data);
          handleMessage(data);
          break;
        default:
          console.error('Unknown message received:', event);
      }
    };
  };

  const requestChatToken = async (username, avatar, callback) => {
    try {
      const response = await axios.post(`${config.API_URL}/auth`, {
        roomIdentifier: config.ROOM_ID,
        userId: `${username}.${uuidv4()}`,
        attributes: {
          username: `${username}`,
          avatar: `${avatar.src}`,
        },
        capabilities: ['SEND_MESSAGE'],
        durationInMinutes: 55,
      });
      const token = response.data.token;
      setToken(token);
      joinChatRoom(token);
      return token;
    } catch (err) {
      console.error('Error requesting chat token:', err);
    }
  };

  const handleError = (data) => {
    let errorString;
    switch (data['ErrorCode']) {
      case 429:
        // Rate limit exceeded
        errorString =
          'Your message was not sent because you exceeded the rate limit';
        break;
      default:
        errorString = data['ErrorMessage'];
        break;
    }
    errorHandler(errorString);
  };

  return {
    token,
    connection,
    messages,
    sendMessage,
    joinChatRoom,
    requestChatToken,
    sendTestMessage,
  };
}
