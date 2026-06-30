export const FEATURE_MAP = {
    networks: {
        lcn: {
            tag: "network",
            label: "Local Cycling Network",
            type: "relation",
        },
        ncn: {
            tag:"network",
            label: "National Cycling Network",
            type: "relation",
        },

        bus: {
            tag: "route",
            label: "Bus Network",
            type: "relation",
        }
    },

    ways: {
        public_footpath: {
            tag:"designation",
            label:"Public Rights of Way",
            type: "way",
        },
        cycleway: {
            tag: "highway",
            label: "Cycle Ways",
            type: "way",
        },
        shared_footway: {
            tag: "highway",
            label: "Shared-Use Footways",
            type: "way",
        },
        school_street: {
            tag: "traffic_intervention",
            label: "School Streets",
            type: "way",
        },
        parking: {
            tag: "amenity",
            label: "Parking",
            type: "way",
        },
    },

    crossings: {
        unmarked: {
            tag: "crossing",
            label: "Unmarked Crossings",
            type: "node",
        },
        zebra: {
            tag: "crossing_ref",
            label: "Zebra",
            type: "node",
        },
        tiger: {
            tag: "crossing_ref",
            label: "Parallel",
            type: "node",
        },
        pelican: {
            tag: "crossing_ref",
            label: "Pelican",
            type: "node",
        },
        puffin: {
            tag: "crossing_ref",
            label: "Puffin",
            type: "node",
        },
        toucan: {
            tag: "crossing_ref",
            label: "Toucan",
            type: "node",
        },
        pegasus: {
            tag: "crossing_ref",
            label: "Pegasus (Equestrian)",
            type: "node",
        }
    },

    publicTransport: {
        station: {
            tag: "railway",
            label: "Railway Stations",
            type: "node",
        },
        bus_stop: {
            tag: "highway",
            label: "Bus Stops",
            type: "node",
        }
    },

    streetFurniture: {
        toilets: {
            tag: "amenity",
            label: "Toilets",
            type: "node",
        },
        bicycle_parking: {
            tag: "amenity",
            label: "Bicycle Parking",
            type: "node",
        },
        bench: {
            tag: "amenity",
            label: "Benches",
            type: "node",
        },
        artwork: {
            tag: "tourism",
            label: "Artwork",
            type: "node",
        },
        wayfinding: {
            tag: "tourism",
            label: "Wayfinding",
            type: "node",
        }
    },

    publicServices: {
        hospital: {
            tag: "amenity",
            label: "Hospitals",
            type: "way",
        },
        police: {
            tag: "amenity",
            label: "Police",
            type: "way",
        },
        fire_station: {
            tag: "amenity",
            label: "Fire Stations",
            type: "way",
        }
    },

    poi: {
        monument: {
            tag: "historic",
            label: "Monuments",
            type: "way",
        },
        place_of_worship: {
            tag: "amenity",
            label: "Places of Worship",
            type: "way",
        }
    },

    buildings: {
        pub: {
            tag: "amenity",
            label: "Pub",
            type: "way",
        }
    },

    recreation: {
        pitch: {
            tag: "leisure",
            label: "Sports Pitch",
            type: "way",
        },
        playground: {
            tag: "leisure",
            label: "Playground",
            type: "way"
        },
        park: {
            tag: "leisure",
            label: "Park",
            type: "way",
        }
    },

    landuse: {
        retail: {
            tag: "landuse",
            label: "Retail",
            type: "way"
        },
        industrial: {
            tag: "landuse",
            label: "Industrial",
            type: "way"
        },
    }
};