/**
 * Model for a subject.
 */
export default class Subject {
  // id of the subject
  private readonly _id: number;
  // name of the subject
  private _name: string;
  // credits of the subject
  private _credits: number;
  // code of the subject
  private _code: string;
  // total number of slots of the subject
  private _slots: number;
  // status of the subject
  private _status: boolean;

  constructor(
    id: number,
    name: string,
    credits: number,
    code: string,
    slots: number,
    status: boolean
  ) {
    this._id = id;
    this._name = name;
    this._credits = credits;
    this._code = code;
    this._slots = slots;
    this._status = status;
  }

  // Getters and Setters
  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get credits(): number {
    return this._credits;
  }

  set credits(value: number) {
    this._credits = value;
  }

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
  }

  get slots(): number {
    return this._slots;
  }

  set slots(value: number) {
    this._slots = value;
  }

  get status(): boolean {
    return this._status;
  }

  set status(value: boolean) {
    this._status = value;
  }
  // End of Getters and Setters
}
