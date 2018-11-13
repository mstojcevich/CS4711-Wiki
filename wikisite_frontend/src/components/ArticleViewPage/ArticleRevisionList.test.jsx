import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ArticleRevisionList from './ArticleRevisionList';
import * as util from '../../util';

configure({ adapter: new Adapter() });

describe('ArticleRevisionList', () => {
  describe('With one revision', () => {
    const revisions = [
      {
        author: 'marcusant',
        creation_date: '2018-10-28T19:34:45.883651Z',
      },
    ];

    // Mock the date format to do something simpler
    util.formatDate = jest.fn(dateStr => `FORMATTED_DATE(${dateStr})END_FORMATTED_DATE`);

    const wrapper = mount(<ArticleRevisionList revisions={revisions} />);
    const entry = wrapper.find('a.item').first();

    it('Contains an entry', () => {
      expect(entry).not.toBe(null);
    });

    it('Contains the username', () => {
      expect(entry.text()).toContain(revisions[0].author);
    });

    it('Formats the date', () => {
      // checks that our patched date formatter was used
      expect(entry.text()).toContain(
        `FORMATTED_DATE(${revisions[0].creation_date})END_FORMATTED_DATE`,
      );
    });
  });
});
