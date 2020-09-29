/** @jsx jsx */
import { jsx } from 'theme-ui';
import * as React from 'react';

import { useClickOutside } from '../hooks/useOutside';

interface IPopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export function Popover(props: IPopoverProps): JSX.Element {
  const ref: React.RefObject<HTMLButtonElement> = React.useRef(null);
  const [hidePopup, setHidePopup] = React.useState(false);
  useClickOutside(ref, setHidePopup);
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setHidePopup(false);
      event.preventDefault();
    },
    [],
  );
  return (
    <button ref={ref} onClick={handleClick} className="relative focus:outline-none">
      {props.children}
      {!hidePopup && (
        <div
          className="absolute right-0 rounded-sm"
          sx={{
            top: (ref.current?.getBoundingClientRect().height || 0) + 8,
            boxShadow: 's',
          }}
        >
          <div
            className="absolute h-4 w-4 transform rotate-45"
            sx={{
              top: '-8px',
              right: '8px',
              backgroundColor: 'background',
              boxShadow: 's',
            }}
          />
          <div
            className="relative py-2 rounded-sm"
            sx={{
              bg: 'background',
            }}
          >
            {props.content}
          </div>
        </div>
      )}
    </button>
  );
}
