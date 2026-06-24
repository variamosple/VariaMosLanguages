//modify this to handle the semantics

export class Language {
  id?: number;
  name: string;
  abstractSyntax: string;
  concreteSyntax: string;
  type: string;
  stateAccept: string;
  semantics: string;
  accessLevel?: string;
  ownerId?: string;
  ownerName?: string;

  constructor(
    id: number,
    name: string,
    abstractSyntax: string,
    concreteSyntax: string,
    type: string,
    stateAccept?: string,
    semantics?: string,
    accessLevel?: string,
    ownerId?: string,
    ownerName?: string
  ) {
    this.id = id;
    this.name = name;
    this.abstractSyntax = abstractSyntax;
    this.concreteSyntax = concreteSyntax;
    this.type = type;
    this.stateAccept = stateAccept;
    this.semantics = semantics;
    this.ownerId = ownerId;
    this.accessLevel = accessLevel;
    this.ownerName = ownerName;
  }
}
