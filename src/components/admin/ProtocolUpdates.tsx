import { Box, Container, FormControlLabel, Grid, Switch, Typography } from '@mui/material';
import FieldLoadingButton from '../core/FieldLoadingButton';
import { useEffect, useState } from 'react';
import { throwErrorMessage } from '../../helpers/errors';
import useTransaction from '../../store/hooks/useTransaction';
import { Result } from '../../types';
import useWebStore from '../../store/useWebStore';
import toast from 'react-hot-toast';

const ProtocolUpdates = () => {
  const wagmiConfig = useWebStore((state) => state.wagmiConfig);
  const {
    pauseStaking,
    unpauseStaking,
    pauseUnstaking,
    unpauseUnstaking,
    getStakingAndUnstakingStatus
  } = useTransaction();
  const [pauseUnpauseUnstaking, setPauseUnpauseUnstaking] = useState(false);
  const [pauseUnpauseStaking, setPauseUnpauseStaking] = useState(false);

  const fetchStatus = async () => {
    const status = (await getStakingAndUnstakingStatus()) as Result[];
    const resStatus = status?.[0]?.result;
    setPauseUnpauseStaking(resStatus?.[0] as unknown as boolean);
    setPauseUnpauseUnstaking(resStatus?.[1] as unknown as boolean);
  };

  const [loadingStates, setLoadingStates] = useState({
    loadPauseUnpauseStaking: false,
    loadPauseUnpauseUnstaking: false
  });

  const handleStakingButton = async () => {
    try {
      setLoadingStates({ ...loadingStates, loadPauseUnpauseStaking: true });
      if (pauseUnpauseStaking) {
        await pauseStaking();
        toast?.success('Successfully paused staking');
      } else {
        await unpauseStaking();
        toast?.success('Successfully unpaused staking');
      }
    } catch (error) {
      throwErrorMessage(error);
    } finally {
      setLoadingStates({ ...loadingStates, loadPauseUnpauseStaking: false });
    }
  };

  const handleUnstakingButton = async () => {
    try {
      setLoadingStates({ ...loadingStates, loadPauseUnpauseUnstaking: true });
      if (pauseUnpauseUnstaking) {
        await pauseUnstaking();
        toast?.success('Successfully paused unstaking');
      } else {
        await unpauseUnstaking();
        toast?.success('Successfully unpaused unstaking');
      }
    } catch (error) {
      throwErrorMessage(error);
    } finally {
      setLoadingStates({ ...loadingStates, loadPauseUnpauseUnstaking: false });
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [wagmiConfig]);

  return (
    <Box marginY={2}>
      <Typography fontSize="1.75rem" color="#DEE2EE" gutterBottom>
        Protocol Updates
      </Typography>
      <Container maxWidth="md">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <FormControlLabel
              control={
                <Switch
                  checked={pauseUnpauseStaking}
                  onChange={(e) => setPauseUnpauseStaking(e.target.checked)}
                />
              }
              label="Pause/Unpause Staking"
            />
          </Grid>
          <Grid item xs={3}>
            <FieldLoadingButton
              label="Update Staking"
              loading={loadingStates.loadPauseUnpauseStaking}
              onClick={() => handleStakingButton()}
            />
          </Grid>
          <Grid item xs={9}>
            <FormControlLabel
              control={
                <Switch
                  checked={pauseUnpauseUnstaking}
                  onChange={(e) => setPauseUnpauseUnstaking(e.target.checked)}
                />
              }
              label="Pause/Unpause Unstaking"
            />
          </Grid>
          <Grid item xs={3}>
            <FieldLoadingButton
              label="Update Unstaking"
              loading={loadingStates.loadPauseUnpauseUnstaking}
              onClick={() => handleUnstakingButton()}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProtocolUpdates;
