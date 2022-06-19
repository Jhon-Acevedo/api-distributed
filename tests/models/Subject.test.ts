import Subject from '../../src/models/Subject';

describe('Subject Model', () => {
  let subject: Subject;

  beforeEach(() => {
    subject = new Subject(2, 'Subject', 1, 'code', 1, true);
  });

  test('if id is 2, result should be 2', () => {
    expect(subject.id).toBe(2);
  });

  test('if name is Subject, result should be Subject', () => {
    expect(subject.name).toBe('Subject');
  });

  test('if credits is 1, result should be 1', () => {
    expect(subject.credits).toBe(1);
  });

  test('if code is code, result should be code', () => {
    expect(subject.code).toBe('code');
  });

  test('if slots is 1, result should be 1', () => {
    expect(subject.slots).toBe(1);
  });

  test('if status is true, result should be true', () => {
    expect(subject.status).toBe(true);
  });

  test('if status is false, result should be false', () => {
    subject.status = false;
    expect(subject.status).toBe(false);
  });

  test('if status is true, result should be true', () => {
    subject.status = true;
    expect(subject.status).toBe(true);
  });

  test('if change name to new name, result should be new name', () => {
    subject.name = 'New Subject';
    expect(subject.name).toBe('New Subject');
  });

  test('if change credits to "2", result should be "2"', () => {
    subject.credits = 2;
    expect(subject.credits).toBe(2);
  });

  test('if change code to "new code", result should be "new code"', () => {
    subject.code = 'new code';
    expect(subject.code).toBe('new code');
  });

  test('if change slots to "2", result should be "2"', () => {
    subject.slots = 2;
    expect(subject.slots).toBe(2);
  });
});
