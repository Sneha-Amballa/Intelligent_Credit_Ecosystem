import Link from "next/link";
import "./DashboardLandComponent.css";
import { LinearProgress } from "@mui/material";

function DashboardLandComponent({ land, userStats }) {
  return (
    <Link href={`/lessons/${land.id}`} passHref>
      <div className="landContainer">
        <div style={{ position: "relative" }}>
          <img className="landImage" src={land.landImage} alt="logo" />
          <img className="landImageFreind" src={land.friendImage} alt="logo" />
        </div>
        <div className="nameContainer">
          <p className="name">{land.name}</p>
          <LinearProgress
            className="landProgress"
            color="success"
            variant="determinate"
            value={
              land.id != 5 ? userStats?.completionPercentages[land.id] : 100
            }
          ></LinearProgress>
        </div>
      </div>
    </Link>
  );
}

export default DashboardLandComponent;
