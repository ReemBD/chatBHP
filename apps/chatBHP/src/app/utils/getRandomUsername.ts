
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