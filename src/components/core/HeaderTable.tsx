import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

type SummaryData = {
  header: string;
  value: string | number | JSX.Element | JSX.Element[] | bigint;
  width?: number; // width is optional, applied only where needed
};

interface ViewRewardSummaryProps {
  data: SummaryData[];
}

/**
 * HeaderTable component renders a Material-UI Table with a TableHead and TableBody.
 * The TableHead contains a single TableRow with TableCell elements for each item in the data prop.
 * The TableBody contains a single TableRow with TableCell elements for each item in the data prop, displaying the value of the item.
 * The TableCell elements are automatically sized based on the width of the content, but can be overridden with the width property in the data item.
 * The component also sets the aria-label prop of the Table to "reward summary table".
 */
const HeaderTable: React.FC<ViewRewardSummaryProps> = ({ data }) => {
  return (
    <TableContainer>
      <Table aria-label="reward summary table">
        <TableHead>
          <TableRow>
            {data.map((item, index) => {
              return (
                <TableCell key={index} sx={item.width ? { minWidth: item.width } : undefined}>
                  {item.header}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {data.map((item, index) => (
              <TableCell key={index} sx={item.width ? { minWidth: item.width } : undefined}>
                {typeof item.value !== 'bigint' ? item.value : String(item.value)}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HeaderTable;
