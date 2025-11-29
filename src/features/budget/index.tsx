import { Box, Grid, Typography } from "@mui/material";
import BudgetAllocation from "./components/BudgetAllocation";
// import IncomeSources from "./components/IncomeSources";
import ExpenseLimits from "./components/BudgetLimits";
// import Savings from "./components/Savings";

export default function Budget() {
  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Box sx={{ paddingBlock: 2 }}>
          <Typography variant="h1">NGÂN SÁCH</Typography>
          <Typography variant="h6">Theo dõi và kiểm soát chi tiêu của bạn</Typography>
        </Box>
        <Grid container spacing={2} >
          {/* <Grid item xs={12} md={6} lg={8}>
            <IncomeSources />
          </Grid> */}
          <Grid item xs={12} md={6} lg={6}>
            <ExpenseLimits />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <BudgetAllocation />
          </Grid>
          {/* <Grid item xs={12} md={6} lg={6}>
            <Savings />
          </Grid> */}
        </Grid>
      </Box>
    </>
  );
}
