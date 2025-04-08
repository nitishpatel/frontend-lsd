import { useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Box, FormHelperText, FormLabel, Grid } from '@mui/material';

interface DateRangePickerFieldProps {
  label: string;
  start?: Date | null;
  end?: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
}

/**
 * A custom DateRangePicker component using two DatePicker components and useState.
 *
 * @param {string} label - The label to be displayed for the field.
 * @param {Date | null} start - The initial start date.
 * @param {Date | null} end - The initial end date.
 * @param {function} onDateChange - Callback to handle date changes.
 *
 * @returns {JSX.Element} The rendered date range picker component.
 */

const DateRangePickerField = ({
  label,
  start = null,
  end = null,
  onDateChange
}: DateRangePickerFieldProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleStartDateChange = (start: Date | null) => {
    if (start && end && start > end) {
      setError('Start date cannot be later than end date');
    } else {
      setError(null);
      onDateChange(start, end);
    }
  };

  const handleEndDateChange = (end: Date | null) => {
    if (start && end && start > end) {
      setError('End date cannot be earlier than start date');
    } else {
      setError(null);
      onDateChange(start, end);
    }
  };

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FormLabel>{label}</FormLabel>
        <Grid
          container
          maxWidth="sm"
          mt={1.5}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          <Grid item lg={6} md={6} xs={12} sm={12}>
            <DatePicker
              label="Start Date"
              value={start}
              onChange={handleStartDateChange}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  size: 'small',
                  error: Boolean(error),
                  sx: {
                    width: 200
                  }
                },
                day: { sx: { color: '#ffffff' } },
                openPickerButton: { sx: { color: '#ffffff' } }
              }}
            />
          </Grid>
          <Grid item lg={6} md={6} xs={12} sm={12}>
            <DatePicker
              label="End Date"
              minDate={start || new Date()}
              value={end}
              onChange={handleEndDateChange}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  size: 'small',
                  error: Boolean(error),
                  sx: {
                    width: 200
                  }
                },
                day: { sx: { color: '#ffffff' } },
                openPickerButton: { sx: { color: '#ffffff' } }
              }}
            />
            <FormHelperText>{error}</FormHelperText>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

export default DateRangePickerField;
