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

    transport: {
        station: {
            tag: "railway",
            label: "Railway Stations",
            type: "node",
        },
        bus_stop: {
            tag: "highway",
            label: "Bus Stops",
            type: "node",
        },
        parking: {
            tag: "amenity",
            label: "Parking",
            type: "way",
        },
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
        wayfinding: {
            tag: "tourism",
            label: "Wayfinding",
            type: "node",
        }
    },

    publicServices: {
        townhall: {
            tag: "amenity",
            label: "Town Hall",
            type: "way",
        },
        courthouse: {
            tag: "amenity",
            label: "Court House",
            type: "way",
        },
        post_office: {
            tag: "amenity",
            label: "Post Office",
            type: "way",
        },
        parcel_locker: {
            tag: "amenity",
            label: "Parcel Locker",
            type: "way",
        },
        community_centre: {
            tag: "amenity",
            label: "Community Centre",
            type: "way",
        },
        prison: {
            tag: "amenity",
            label: "Prison",
            type: "way",
        },
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
        },
        artwork: {
            tag: "tourism",
            label: "Artwork",
            type: "node",
        },
    },

    fooddrink: {
        restaurant: {
            tag: "amenity",
            label: "Restaurant",
            type: "way",
        },
        cafe: {
            tag: "amenity",
            label: "cafe",
            type: "way",
        },
        fast_food: {
            tag: "amenity",
            label: "Fast Food",
            type: "way",
        },
        pub: {
            tag: "amenity",
            label: "Pub",
            type: "way",
        },
        bar: {
            tag: "amenity",
            label: "Bar",
            type: "way",
        },
    },

    leisure: {
        playground: {
            tag: "leisure",
            label: "Playground",
            type: "way"
        },
        park: {
            tag: "leisure",
            label: "Park",
            type: "way",
        },
        garden: {
            tag: "leisure",
            label: "garden",
            type: "way",
        },
        dog_park: {
            tag: "leisure",
            label: "Dog Park",
            type: "way",
        },
        fitness_centre: {
            tag: "leisure",
            label: "Fitness Centre",
            type: "way",
        },
        sports_centre: {
            tag: "leisure",
            label: "Sports Centre",
            type: "way",
        },
        stadium: {
            tag: "leisure",
            label: "Stadium",
            type: "way",
        },
        swimming_pool: {
            tag: "leisure",
            label: "Sports Pitch",
            type: "way",
        },
        pitch: {
            tag: "leisure",
            label: "Sports Pitch",
            type: "way",
        },
        track: {
            tag: "leisure",
            label: "Track",
            type: "way",
        },
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