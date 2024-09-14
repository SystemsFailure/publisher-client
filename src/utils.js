// Функция генерации случайного ID
export function generateRandomId() {
    const hexCharacters = '0123456789abcdef';
    let objectId = '';
  
    for (let i = 0; i < 24; i++) {
      objectId += hexCharacters.charAt(Math.floor(Math.random() * hexCharacters.length));
    }
  
    return objectId;
  }