"use server";

import { StaticStop } from "@/lib/types/types";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_BUCKET = "bcnbustime";
const SUPABASE_FILE = "stops.csv";

export const getStaticStops = async (): Promise<StaticStop[] | null> => {
  const tmbPath = await fetch(
    SUPABASE_URL +
      "/storage/v1/object/public/" +
      SUPABASE_BUCKET +
      "/" +
      SUPABASE_FILE
  );
  // const ambPath = path.join(process.cwd(), "data/static-gtfs/amb/stops.csv");

  try {
    const tmbData = await tmbPath.text();
    const tmbLines = tmbData.split("\n");

    const tmbStops = tmbLines
      .filter((line, index) => index > 0 && index < tmbLines.length - 1)
      .map((line) => line.split(","));

    const stopMap: Record<string, StaticStop> = {};

    for (const stop of tmbStops) {
      const id = stop[2];
      stopMap[id] = {
        id,
        name: stop[3],
        position: stop[20],
        operators: ["TMB"],
      };
    }

    // const ambData = await fs.readFile(ambPath, "utf-8");
    // const ambLines = ambData.split("\n");

    // const ambStops = ambLines
    //   .filter((line, i) => i > 0 && i < ambLines.length - 1)
    //   .map((line) => line.split(","));

    // for (const stop of ambStops) {
    //   const id = stop[1];
    //   const name = stop[2];
    //   const position = `POINT (${stop[4]} ${stop[5]})`;

    //   if (stopMap[id]) {
    //     if (!stopMap[id].operators.includes("AMB")) {
    //       stopMap[id].operators.push("AMB");
    //     }
    //   } else {
    //     stopMap[id] = {
    //       id,
    //       name,
    //       position,
    //       operators: ["AMB"],
    //     };
    //   }
    // }

    return Object.values(stopMap);
  } catch (error) {
    console.error("Error llegint l'arxiu CSV:", error);
    return null;
  }
};

// export const getStaticRouteById = async (routeId: string) => {
//   const data = {
//     line: "",
//     destination: "",
//   };

//   const routesPath = path.join(
//     process.cwd(),
//     "data/static-gtfs/amb/routes.txt"
//   );

//   try {
//     const routesData = await fs.readFile(routesPath, "utf-8");
//     const routesLines = routesData.split("\n");
//     const route = routesLines.find((line) => line.split(",")[0] === routeId);
//     if (route) {
//       const txtInfo = route.split(",");
//       data.destination = txtInfo[3];
//       data.line = txtInfo[2];
//     }
//   } catch (error) {
//     console.error("Error reading routes.csv: ", error);
//   }

//   return data;
// };
