import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function FrontPage() {
  return (
    <div>
      <div>
        <Button component={Link} to="/gender">
          Name and Gender Change
        </Button>
      </div>
      <div>
        <Button component={Link} to="/gender">
          Eviction Expungement
        </Button>
      </div>
    </div>
  );
}
