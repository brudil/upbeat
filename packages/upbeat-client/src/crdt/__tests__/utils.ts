import { createType } from '../utils';

describe('createType', () => {
  it('should create type', () => {
    const Type = createType<'String', string, number, number>('String', {
      apply(_atom, operation) {
        return [true, operation.toString()];
      },
      realise(atom) {
        return parseInt(atom);
      },
      create() {
        return '100';
      },
    });

    expect(Type).not.toBeNull();
  });
});
