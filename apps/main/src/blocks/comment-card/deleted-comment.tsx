import clsx from 'clsx';
import * as React from 'react';

import { Link } from '$/components/link';

export type DeletedCommentProps = {
  // children: React.ReactNode;
};

export function DeletedComment(props: DeletedCommentProps): JSX.Element {
  return (
    <div className="">
      <Link
        variant="plain"
        href="/docs/features/moderate#deleted-note"
        className="italic"
        target="_blank"
      >
        This comment was deleted by moderator
      </Link>
    </div>
  );
}
