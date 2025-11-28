import { Box, Grid, Typography } from "@mui/material";
// import ExpensePerformance from "./components/ExpensePerformance";
import TransactionHistory from "./components/ExpenseHistory";

export default function Expense() {
  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Box sx={{ paddingBlock: 2, width: "100%" }}>
          <Typography variant="h1">Thu nhập & Chi tiêu</Typography>
          <Typography variant="h6">Mọi thông tin về các giao dịch , gồm thu nhập và chi tiêu, sẽ được hiển thị tại đây.</Typography>
        </Box>
        <Grid sx={{ width: "100%" }}>
          <Grid item xs={12} md={6}>
            <TransactionHistory />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <ExpensePerformance />
          </Grid> */}
        </Grid>
      </Box>
    </>
  );
}
