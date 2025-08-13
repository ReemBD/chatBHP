/**
 * A Lord of the Rings themed username generator.
 */
export function getRandomUsername(): string {
  const characters = [
    "Gandalf", "Aragorn", "Legolas", "Gimli", "Frodo", "Sam", "Merry", "Pippin",
    "Boromir", "Faramir", "Denethor", "Theoden", "Eomer", "Eowyn", "Galadriel",
    "Elrond", "Arwen", "Celeborn", "Thranduil", "Bilbo", "Gollum", "Sauron",
    "Saruman", "Wormtongue", "Treebeard", "Tom", "Goldberry", "Radagast"
  ];

  const places = [
    "Rivendell", "Lothlorien", "Gondor", "Rohan", "Mordor", "Shire", "Bree",
    "Minas", "Edoras", "Helms", "Isengard", "Moria", "Fangorn", "Weathertop",
    "Barad", "Osgiliath", "Pelennor", "Ithilien", "Dol", "Cair", "Dale"
  ];

  const creatures = [
    "Hobbit", "Elf", "Dwarf", "Man", "Wizard", "Orc", "Uruk", "Troll", "Ent",
    "Eagle", "Horse", "Warg", "Nazgul", "Balrog", "Dragon", "Spider", "Watcher",
    "Fell", "Maiar", "Istari", "Ranger", "Knight", "Warrior", "Archer"
  ];

  const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
  const randomPlace = places[Math.floor(Math.random() * places.length)];
  const randomCreature = creatures[Math.floor(Math.random() * creatures.length)];
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 1000–9999

  const combinations = [
    `${randomCharacter}_${randomPlace}_${randomNumber}`,
    `${randomPlace}_${randomCreature}_${randomNumber}`,
    `${randomCharacter}_${randomCreature}_${randomNumber}`,
    `${randomPlace}_${randomCharacter}_${randomNumber}`
  ];

  return combinations[Math.floor(Math.random() * combinations.length)];
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