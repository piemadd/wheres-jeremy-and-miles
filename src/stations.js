export const taxiStations = {
  ogilvie_union: {
    name: "Ogilvie/Union (Riverside Plaza & Madison)",
    coordinates: [
      41.88224963761097,
      -87.63860020208031
    ],
    mapsLink: "https://goo.gl/maps/QtLZUMW7D6PmmNgq8",
    color: "#277bb3",
    textColor: "#fff",
    to: {
      michigan: {
        departures: [],
        duration: 20,
      },
      chinatown: {
        departures: [],
        duration: 30,
      },
    }
  },
  michigan: {
    name: "Michigan Avenue (Wrigley Building & Rush)",
    coordinates: [
      41.88929991088218,
      -87.62521941056612
    ],
    mapsLink: "https://goo.gl/maps/AnDKWCQkLZCEj5sT9",
    color: "#4fd5fc",
    textColor: "#181a1b",
    to: {
      ogilvie_union: {
        departures: [],
        duration: 20,
      },
      chinatown: {
        departures: [],
        duration: 50,
      },
    }
  },
  chinatown: {
    name: "Chinatown (Ping Tom Park)",
    coordinates: [
      41.85714382088655,
      -87.63499474723132
    ],
    mapsLink: "https://goo.gl/maps/sNp2rDfcRrUsRWjj9",
    color: "#522298",
    textColor: "#fff",
    to: {
      ogilvie_union: {
        departures: [],
        duration: 30,
      },
      michigan: {
        departures: [],
        duration: 50,
      },
    }
  },
};

export default taxiStations;