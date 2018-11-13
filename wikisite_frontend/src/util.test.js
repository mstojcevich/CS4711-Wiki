import { formatDate } from './util';

describe('formatDate', () => {
  it('Doesn\'t blow up', () => {
    formatDate('2018-10-28T19:34:45.883651Z');
  });
});
