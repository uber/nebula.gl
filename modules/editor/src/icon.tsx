import * as React from 'react';
import 'boxicons';

export function Icon(props) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'box-icon' does not exist on type 'JSX.In... Remove this comment to see the full error message
  return <box-icon color="currentColor" {...props} />;
}
