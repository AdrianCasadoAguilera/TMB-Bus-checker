import { Temporal } from "@js-temporal/polyfill";

export const mockCsv = `col0,col1,id,name,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16,col17,col18,col19,position
x,x,1234,Parada Gran Via,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,POINT (2.1234 41.4036)
x,x,5678,Parada Diagonal,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,POINT (2.1500 41.4123)
`;

export const stopInfo = {
  totalFeatures: 1,
  features: [
    {
      properties: { NOM_PARADA: "Gran Via" },
      geometry: { coordinates: [2.123, 41.456] },
    },
  ],
};

export const busesOnStop = (nowMs: number) => {
  return {
    parades: [
      {
        codi_parada: "1234",
        linies_trajectes: [
          {
            nom_linia: "D50",
            desti_trajecte: "Pl. Espanya",
            propers_busos: [{ temps_arribada: nowMs + 60000 }],
          },
        ],
      },
    ],
  };
};

export const noBusesOnStop = (nowMs: number) => {
  return {
    parades: [
      {
        codi_parada: "5678",
        linies_trajectes: [
          {
            nom_linia: "D50",
            desti_trajecte: "Pl. Espanya",
            propers_busos: [{ temps_arribada: nowMs + 60000 }],
          },
        ],
      },
    ],
  };
};
