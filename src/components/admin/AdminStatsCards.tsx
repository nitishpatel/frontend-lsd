import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { AdminCardProps } from '../../types';

/**
 * AdminStatCards component renders a single card in the admin dashboard with a title, icon, count, and optional view and add buttons.
 *
 * The component uses the `AdminCardProps` interface to define the structure of the props.
 *
 * @prop {string} title - The title of the card.
 * @prop {number|string|undefined} count - The count to display in the card. If undefined, the count is not displayed.
 * @prop {string} iconPath - The path to the icon to display in the card.
 * @prop {string} dividerColor - The color of the divider that separates the card content from the card actions.
 * @prop {() => void} viewClick - The function to call when the view button is clicked.
 * @prop {() => void} addClick - The function to call when the add button is clicked.
 * @prop {string} viewButtonText - The text to display on the view button. Defaults to 'View'.
 *
 * @example
 * <AdminStatCards title="Protocol Set up" iconPath={stats1} dividerColor="#81681A" viewClick={() => {}} />
 */
export const AdminStatCards = ({
  title,
  count,
  iconPath,
  dividerColor,
  viewClick,
  addClick,
  viewButtonText = 'View'
}: AdminCardProps) => {
  return (
    <Box
      sx={{
        p: '0.063rem',
        borderRadius: '0.75rem',
        minWidth: '13.625rem',
        minHeight: '14.5rem',
        background: 'linear-gradient(46deg, #0D0D0D 0%, #3E4A6C 52%, #0D0D0D 93%, #0D111D 100%)'
      }}
      data-testid={`admin-card-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <Card
        sx={{
          minWidth: '13.625rem',
          minHeight: '14.5rem',
          borderRadius: '0.75rem',
          background: '#0D0D0D'
        }}
      >
        <Avatar alt="stats" src={iconPath} sx={{ width: 56, height: 56, px: 3, pt: 3 }} />
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: count ? 'space-between' : 'center',
            alignItems: 'center',
            p: 2,
            minHeight: '50px',
            px: 3
          }}
        >
          <Typography gutterBottom variant="h4" component="div" color="#FFFFFF">
            {count}
          </Typography>
          <Typography textAlign="center" variant="body2" color="#A3A5AC">
            {title}
          </Typography>
        </CardContent>
        <Divider color={dividerColor} variant="fullWidth" sx={{ borderBottomWidth: 1 }} />
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: addClick && viewClick ? 'space-evenly' : 'flex-end',
            alignItems: 'center',
            height: '3.375rem'
          }}
        >
          {viewClick && (
            <Button
              onClick={viewClick}
              size="small"
              color="primary"
              data-testid="admin-card-view-button"
            >
              {viewButtonText}
            </Button>
          )}
          {addClick && (
            <Button
              onClick={addClick}
              size="small"
              variant="contained"
              color="secondary"
              data-testid="admin-card-add-button"
            >
              Add
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};
