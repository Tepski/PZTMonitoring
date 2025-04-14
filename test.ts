class Person {
  private name: string;

  public constructor(name: string) {
    this.name = name;
  }

  public getName = () => {
    return this.name;
  };
}

const person = new Person("Jane");

console.log(person.getName());
