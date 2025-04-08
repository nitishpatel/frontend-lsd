import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface MenuButtonProps {
  icon?: React.ReactNode;
  menuContent: (handleClose: () => void) => React.ReactNode;
  buttonAriaLabel?: string;
  ITEM_HEIGHT?: number;
}

/**
 * A component that renders a Material-UI `IconButton` that opens a
 * `Menu` on click. The `Menu` is rendered with the provided
 * `menuContent` and has a maximum height of 4.5 times the `ITEM_HEIGHT`
 * constant.
 *
 * @param {React.ReactNode} icon - The icon to render inside the
 *   `IconButton`. Defaults to `<MoreVertIcon />`.
 * @param {React.ReactNode} menuContent - The content to render inside
 *   the `Menu`.
 * @param {string} buttonAriaLabel - The ARIA label for the `IconButton`.
 *   Defaults to `"more"`.
 */

export default function MenuButton({
  icon = <MoreVertIcon />,
  menuContent,
  buttonAriaLabel = 'more',
  ITEM_HEIGHT = 48
}: MenuButtonProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label={buttonAriaLabel}
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {icon}
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              padding: 8
            }
          }
        }}
      >
        {menuContent(handleClose)}
      </Menu>
    </div>
  );
}
