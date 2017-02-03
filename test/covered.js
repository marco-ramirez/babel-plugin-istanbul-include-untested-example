/* global describe it */
import covered from '../src/covered';
import assert from 'assert';

describe('covered', () => {
    it('should return a string', () => {
        assert.ok(/covered$/.test(covered()));
        assert.ok(/BLAH/.test(covered('BLAH')));
    });
});
