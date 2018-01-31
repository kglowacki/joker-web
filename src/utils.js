import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'

export function mutator(changes, cloneDeepChanges) {
    return function(state) {
        state = cloneDeep(state);
        if (cloneDeepChanges) changes = cloneDeep(changes);
        for (let prop of Object.getOwnPropertyNames(changes)) {
            set(state, prop, changes[prop]);
        }
        return state;
    }
}