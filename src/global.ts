export class Global {
  private static instance: Global;

  static getInstance() {
    if (!Global.instance) {
      Global.instance = new Global();
    }
    return Global.instance;
  }

  public getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  public generateRandomNickName(): string {
    const adjectives_en = [
      'Happy', 'Brave', 'Fuzzy', 'Swift', 'Witty', 'Silent', 'Cheerful', 'Quirky', 'Loyal', 'Zany',
    ];
    const nouns_en = [
      'Tiger', 'Panda', 'Otter', 'Fox', 'Eagle', 'Bear', 'Koala', 'Penguin', 'Wolf', 'Raccoon',
    ];
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    return `${this.getRandomItem(adjectives_en)}${this.getRandomItem(nouns_en)}${randomNumber}`;
  }
}
