import * as inspectpack from 'inspectpack';
import { from, Observable } from 'rxjs';

const { actions } = inspectpack;
const INSPECTPACK_PROBLEM_ACTIONS = ['duplicates', 'versions'];
const INSPECTPACK_PROBLEM_TYPE = 'problems';

export function parseSizes(stats): Observable<any> {
  const sizes$ = actions('sizes', { stats })
    .then(instance => instance.getData())
    .then(data => ({
      type: 'sizes',
      value: data,
    }))
    .catch(err => ({
      type: 'sizes',
      error: true,
      value: err,
    }));

  return from(sizes$);
}

export function parseProblems(stats): Observable<any> {
  const problems$ = Promise.all(
    INSPECTPACK_PROBLEM_ACTIONS.map(action =>
      actions(action, { stats }).then(instance => instance.getData()),
    ),
  )
    .then(datas => ({
      type: INSPECTPACK_PROBLEM_TYPE,
      value: INSPECTPACK_PROBLEM_ACTIONS.reduce(
        (memo, action, i) =>
          Object.assign({}, memo, {
            [action]: datas[i],
          }),
        {},
      ),
    }))
    .catch(err => ({
      type: INSPECTPACK_PROBLEM_TYPE,
      error: true,
      value: err,
    }));

  return from(problems$);
}
