import { ChatUser } from "../tokens/chat-user.token";

/**
 * A reddit like username generator.
 */
export function getRandomUsername(): string {
    const adjectives = [
      "Fluffy", "Sassy", "Mighty", "Sleepy", "Cheeky", "Witty", "Grumpy",
      "Happy", "Clever", "Brave", "Fuzzy", "Sneaky", "Chill", "Epic", "Bouncy"
    ];
  
    const animals = [
      "Tiger", "Panda", "Otter", "Llama", "Penguin", "Fox", "Koala",
      "Eagle", "Shark", "Sloth", "Hedgehog", "Dolphin", "Wolf", "Bear", "Cat"
    ];
  
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 1000–9999
  
    return `${randomAdjective}${randomAnimal}_${randomNumber}`;
  }

/**
 * A random color generator.
 */
  export function getRandomColor(): string {
    const min = 0;
    const max = 100;
    const r = Math.floor(Math.random() * (max - min) + min);
    const g = Math.floor(Math.random() * (max - min) + min);
    const b = Math.floor(Math.random() * (max - min) + min);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  export function getRandomChatUser(): ChatUser {
    return {
        username: getRandomUsername(),
        color: getRandomColor(),
    }
  }