// @flow
/* eslint-env jest */

import { fromJS, List } from 'immutable';

describe('immutable', () => {
  it('works', () => {
    let list1 = List([List([1, 2, 3]), List([11, 22, 33])]);

    list1 = list1.setIn([1, 2], 333);
    expect(list1.toJS()).toEqual([[1, 2, 3], [11, 22, 333]]);

    list1 = list1.updateIn([1], list => list.push(44));
    expect(list1.toJS()).toEqual([[1, 2, 3], [11, 22, 333, 44]]);

    // const list = fromJS([0, 1, 2, [3, 4]]);
    // expect(list1.setIn([3, 0], 999).toJS()).toEqual([0, 1, 2, [999, 4]]);
    // expect(list1.updateIn([3, 0], 999).toJS()).toEqual([0, 1, 2, [999, 4]]);

    let list2 = fromJS([[1, 2, 3], [11, 22, 33]]);

    list2 = list2.setIn([1, 2], 333);
    expect(list2.toJS()).toEqual([[1, 2, 3], [11, 22, 333]]);

    list2 = list2.updateIn([1], list => list.push(44));
    expect(list2.toJS()).toEqual([[1, 2, 3], [11, 22, 333, 44]]);

    // const editable = new EditableFeatureCollection(featureCollection);

    // expect(editable.getObject()).toBe(featureCollection);
  });
});
