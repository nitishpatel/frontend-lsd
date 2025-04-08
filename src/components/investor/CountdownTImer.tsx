import Countdown from 'react-countdown';
import { Typography, Grid, Chip } from '@mui/material';

interface CountdownTimerProps {
  maturityDate: Date;
  simple?: boolean;
  showDay?: boolean;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
}

const CountdownTimer = ({
  maturityDate,
  simple = false,
  showDay = false,
  showHour = false,
  showMinute = false,
  showSecond = false
}: CountdownTimerProps) => {
  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return (
        <Grid>
          <Typography>{simple ? 'Matured' : 'Closed'}</Typography>
        </Grid>
      );
    } else {
      return (
        <Grid sx={{ width: '100%' }}>
          {simple ? (
            <Typography>
              {days}d {hours}h {minutes}m {seconds}s
            </Typography>
          ) : (
            <Grid container>
              {showDay && (
                <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                  <Chip
                    label={days}
                    sx={{
                      // background: '#2B2D36',
                      background: '#131313',
                      borderRadius: '8px',
                      width: '55px',
                      height: '30px',
                      color: '#ffffff',
                      fontWeight: 800
                    }}
                  />
                  {/* <Typography sx={{ fontSize: '0.9rem' }}>Days</Typography> */}
                </Grid>
              )}
              {showHour && (
                <Grid item xs={3}>
                  <Chip
                    label={hours}
                    sx={{
                      background: '#2B2D36',
                      borderRadius: '8px',
                      width: '55px',
                      height: '30px',
                      color: '#ffffff',
                      fontWeight: 800
                    }}
                  />
                  <Typography sx={{ fontSize: '0.9rem' }}>Hours</Typography>
                </Grid>
              )}
              {showMinute && (
                <Grid item xs={3}>
                  <Chip
                    label={minutes}
                    sx={{
                      background: '#2B2D36',
                      borderRadius: '8px',
                      width: '55px',
                      height: '30px',
                      color: '#ffffff',
                      fontWeight: 800
                    }}
                  />
                  <Typography sx={{ fontSize: '0.9rem' }}>Minutes</Typography>
                </Grid>
              )}
              {showSecond && (
                <Grid item xs={3}>
                  <Chip
                    label={seconds}
                    sx={{
                      background: '#2B2D36',
                      borderRadius: '8px',
                      width: '55px',
                      height: '30px',
                      color: '#ffffff',
                      fontWeight: 800
                    }}
                  />
                  <Typography sx={{ fontSize: '0.9rem' }}>Seconds</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      );
    }
  };
  return (
    <Grid>
      <Countdown date={maturityDate} renderer={renderer} />
    </Grid>
  );
};

export default CountdownTimer;
