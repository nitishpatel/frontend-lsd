/**
 * AdminDashboard component renders the dashboard with various statistic cards.
 *
 * This component uses the `useAuthStore` and `useAppStore` hooks to fetch data and
 * authenticate the user. It also uses the `useNavigate` hook to navigate to
 * different routes.
 *
 * The component renders a grid of statistic cards, each with a title, icon, and
 * optional count, view, and add click handlers. The cards are conditionally
 * rendered based on the user's role (ADMIN or Anchor Investor).
 *
 * @example
 * <AdminDashboard />
 */

import { Box, Grid } from '@mui/material';
import Page from '../../components/defaults/Page';
import { AdminStatCards } from '../../components/admin/AdminStatsCards';
import { AdminCardProps } from '../../types';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import stats1 from '../../assets/stats-01.svg';
import stats2 from '../../assets/stats-02.svg';
import stats3 from '../../assets/stats-03.svg';
import stats4 from '../../assets/stats-04.svg';
import stats5 from '../../assets/stats-05.svg';

/**
 * AdminDashboard component renders the dashboard with various statistic cards.
 */
const AdminDashboard = () => {
  const {} = useAppStore();

  const navigate = useNavigate();

  // Cards Data for Admin
  const adminCardsData: AdminCardProps[] = [
    {
      title: 'Protocol Set up',
      iconPath: stats1,
      dividerColor: '#81681A',
      viewClick: () => {
        navigate('/admin/protocol-setup');
      },
      viewButtonText: 'View/Edit'
    },
    {
      title: 'Inventory',
      iconPath: stats2,
      dividerColor: '#1D7DBC',
      viewClick: () => {
        navigate('/admin/protocol-inventory');
      }
    },
    {
      title: 'Valid Staking',
      iconPath: stats3,
      dividerColor: '#1C2F88',
      viewClick: () => {
        navigate('/admin/valid-staking');
      }
    },
    {
      title: 'stXDC Valuation',
      iconPath: stats4,
      dividerColor: '#16761C',
      viewClick: () => {
        navigate('/admin/stxdc-valuation');
      }
    }
    // {
    //   title: 'Reports',
    //   iconPath: stats5,
    //   dividerColor: '#1D7DBC',
    //   viewClick: () => {
    //     navigate('/admin');
    //   }
    // }
  ];

  return (
    <Page fixedHeight>
      <Box mt={16}>
        <Grid
          container
          spacing="1.875rem"
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
        >
          {adminCardsData.map((card: AdminCardProps, index: number) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={3}
              xl={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              key={index}
            >
              <AdminStatCards
                title={card.title}
                iconPath={card.iconPath}
                dividerColor={card.dividerColor}
                count={card?.count === 0 ? '0' : card?.count}
                viewClick={card.viewClick}
                addClick={card?.addClick}
                viewButtonText={card?.viewButtonText}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Page>
  );
};

export default AdminDashboard;
