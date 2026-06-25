export class User {
  id?: number;
  user?: string;
  name?: string;
  email?: string;

  constructor(
    id: number,
    user?: string,
    name?: string,
    email?: string,

  ) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.email = email;
  }
}
