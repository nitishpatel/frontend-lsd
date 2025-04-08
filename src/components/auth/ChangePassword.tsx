import { useState } from 'react';

import {
  Container,
  Card,
  Grid,
  Box,
  CardContent,
  Typography,
  TextField,
  FormLabel,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  InputAdornment
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { throwErrorMessage } from '../../helpers/errors';
import Page from '../defaults/Page';
import { passwordRegex } from '../../helpers/regex';
import buildApi from '../../store/useApiStore';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

interface ChangePasswordProps {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout } = useAuthStore();
  const { changePassword } = buildApi();

  const ChangePasswordSchema: ZodType = z
    .object({
      old_password: z.string().nonempty('Old Password is required'),
      new_password: z
        .string()
        .min(8, 'Password must be minimum 8 characters long')
        .regex(
          passwordRegex,
          'Must Contain at least one Uppercase, one Lowercase, one Number, and one special character'
        )
        .nonempty('New Password is required'),
      confirm_password: z.string().nonempty('Confirm New Password is required')
    })
    .superRefine(({ new_password, confirm_password }, ctx) => {
      if (new_password !== confirm_password) {
        ctx.addIssue({
          code: 'custom',
          path: ['confirm_password'], // Specify which field has the issue
          message: 'Passwords must match'
        });
      }
    });

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<ChangePasswordProps>({
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: zodResolver(ChangePasswordSchema)
  });

  const onSubmit = async (data: ChangePasswordProps) => {
    try {
      setIsSubmitting(true);
      console.log(data);

      // API call to change password
      await changePassword(data);

      // Logout after successful password change
      await logout();

      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      throwErrorMessage(error); // Handle the error properly
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Page title="Change Password">
        <Container sx={{ my: 2 }}>
          <Card>
            <Container>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent sx={{ m: 2 }}>
                  <Grid container spacing={3} sx={{ width: '100%' }}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ pr: 2 }}>
                      <Grid item lg={12} md={6} xs={12} sm={12}>
                        <FormLabel>Old Password</FormLabel>
                        <TextField
                          sx={{ mt: 1.5 }}
                          {...register('old_password')}
                          error={Boolean(errors.old_password && errors.old_password)}
                          helperText={errors.old_password && errors.old_password?.message}
                          fullWidth
                          size="small"
                          autoComplete="off"
                          type={showOldPassword ? 'text' : 'password'}
                          placeholder="Enter Old Password"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    setShowOldPassword((show) => !show);
                                  }}
                                  edge="end"
                                >
                                  {showOldPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item lg={12} md={6} xs={12} sm={12} sx={{ mt: 2 }}>
                        <FormLabel>New Password</FormLabel>
                        <TextField
                          sx={{ mt: 1.5 }}
                          {...register('new_password')}
                          error={Boolean(errors.new_password && errors.new_password)}
                          helperText={errors.new_password && errors.new_password?.message}
                          fullWidth
                          size="small"
                          autoComplete="off"
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Enter New Password"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    setShowNewPassword((show) => !show);
                                  }}
                                  edge="end"
                                >
                                  {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item lg={12} md={6} xs={12} sm={12} sx={{ mt: 2 }}>
                        <FormLabel>New Password Confirmation</FormLabel>
                        <TextField
                          sx={{ mt: 1.5 }}
                          {...register('confirm_password')}
                          error={Boolean(errors.confirm_password && errors.confirm_password)}
                          helperText={errors.confirm_password && errors.confirm_password?.message}
                          fullWidth
                          size="small"
                          autoComplete="off"
                          type="password"
                          placeholder="Confirm New Password"
                        />
                      </Grid>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ pr: 1 }}>
                      <Grid item lg={12} md={6} xs={12} sm={12}>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          In order to protect your account, make sure your password is:
                        </Typography>
                        <List>
                          <ListItem>
                            <ListItemText
                              secondary="New password must be different from previously used old password"
                              secondaryTypographyProps={{ color: '#ffffff' }}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              secondary="At least 8 characters long"
                              secondaryTypographyProps={{ color: '#ffffff' }}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              secondary="Characters from 3 different groups(lowercase, uppercase, numbers, special characters)"
                              secondaryTypographyProps={{ color: '#ffffff' }}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      mt: 4,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'end',
                      alignItems: 'center'
                    }}
                  >
                    <Button
                      sx={{
                        px: 3,
                        height: '2.5rem'
                      }}
                      variant="outlined"
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      size="large"
                      loadingPosition="start"
                      loading={isSubmitting}
                      sx={{
                        px: 3,
                        ml: 2
                      }}
                    >
                      Change Password
                    </LoadingButton>
                  </Box>
                </CardContent>
              </form>
            </Container>
          </Card>
        </Container>
      </Page>
    </>
  );
};

export default ChangePassword;
