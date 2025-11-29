import { CardContent } from "@mui/material";
import Item from "../../../components/Item";
import { BudgetAllocationChart } from "./BudgetAllocationChart";
import { budgetAllocationData } from "../data/budget";

const BudgetAllocation = () => {
  return (
    <Item
      title="Biểu đồ phân bổ ngân sách chi tiêu"
      content={
        <CardContent style={{ height: "400px", padding: 0 }}>
          <BudgetAllocationChart data={budgetAllocationData} />
        </CardContent>
      }
      height={500}
    />
  );
};

export default BudgetAllocation;
