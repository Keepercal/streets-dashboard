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

    vehicle_highways: {
        motorway: {
            tag:"highway",
            label:"Motorway",
            type: "way",
        },
        trunk: {
            tag:"highway",
            label:"Trunk",
            type: "way",
        },
        primary: {
            tag:"highway",
            label:"Primary",
            type: "way",
        },
        secondary: {
            tag:"highway",
            label:"Secondary",
            type: "way",
        },
        tertiary: {
            tag:"highway",
            label:"Tertiary",
            type: "way",
        },
        residential: {
            tag:"highway",
            label:"Residential",
            type: "way",
        },
        service: {
            tag:"highway",
            label:"Service",
            type: "way",
        },
    },

    active_travel_highways: {
        footway: {
            tag: "highway",
            label: "Footway",
            type: "way",
        },
        shared_footway: {
            tag: "highway",
            label: "Shared-Use Footways",
            type: "way",
        },
        path: {
            tag:"highway",
            label:"Path",
            type: "way",
        },
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
        bridleway: {
            tag:"highway",
            label:"Public Rights of Way",
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

    streetFurniture: {
        toilets: {
            tag: "amenity",
            label: "Toilets",
            type: "node",
        },
        bench: {
            tag: "amenity",
            label: "Benches",
            type: "node",
        },
        information: {
            tag: "tourism",
            label: "Wayfinding",
            type: "node",
        },
        waste_basket: {
            tag: "amenity",
            label: "Waste Bin",
            type: "node",
        },
        recycling: {
            tag: "amenity",
            label: "Recycling",
            type: "node",
        },
        drinking_water: {
            tag: "amenity",
            label: "Drinking Water",
            type: "node",
        },
        picnic_site: {
            tag: "amenity",
            label: "Picnic Table",
            type: "node",
        },
    },

    transport: {
        station: {
            tag: "railway",
            label: "Railway Station",
            type: "node",
        },
        bus_station: {
            tag: "amenity",
            label: "Bus Station",
            type: "node",
        },
        bus_stop: {
            tag: "highway",
            label: "Bus Stops",
            type: "node",
        },
        tram_stop: {
            tag: "highway",
            label: "Tram Stops",
            type: "node",
        },      
        airport: {
            tag: "aeroway",
            label: "Airport",
            type: "way",
        },
        taxi: {
            tag: "amenity",
            label: "Taxi Rank",
            type: "node",
        },
        parking: {
            tag: "amenity",
            label: "Parking",
            type: "way",
        },
    },

    driving: {
        parking: {
            tag: "amenity",
            label: "Parking",
            type: "way",
        },     
        fuel: {
            tag: "amenity",
            label: "Fuel Station",
            type: "way",
        },
        charging_station: {
            tag: "amenity",
            label: "EV Charger",
            type: "node",
        },
        car_wash: {
            tag: "amenity",
            label: "Car Wash",
            type: "way",
        },
        car_rental: {
            tag: "amenity",
            label: "Car Rental",
            type: "way",
        },
        car_repair: {
            tag: "shop",
            label: "Garage",
            type: "way",
        },
    },

    cycling: {
        bicycle_parking: {
            tag: "amenity",
            label: "Bicycle Parking",
            type: "way",
        },
        bicycle_rental: {
            tag: "amenity",
            label: "Bicycle Rental",
            type: "way",
        },
        bicycle_shop: {
            tag: "shop",
            label: "Bicycle Shop",
            type: "way",
        },
        bicycle_repair_station: {
            tag: "amenity",
            label: "Repair Station",
            type: "way",
        },
    },

    healthcare: {
        hospital: {
            tag: "amenity",
            label: "Hospital",
            type: "way",
        },
        clinic: {
            tag: "amenity",
            label: "Clinic",
            type: "way",
        },
        doctors: {
            tag: "amenity",
            label: "Doctors",
            type: "way",
        },
        dentist: {
            tag: "amenity",
            label: "Dentist",
            type: "way",
        },
        Pharmacy: {
            tag: "amenity",
            label: "Pharmacy",
            type: "way",
        },
        veterinary: {
            tag: "amenity",
            label: "Veterinary",
            type: "way",
        },
        defibrillator: {
            tag: "amenity",
            label: "Defibrillator",
            type: "way",
        },
    },

    emergency: {
        police: {
            tag: "amenity",
            label: "Police",
            type: "way",
        },
        fire_station: {
            tag: "amenity",
            label: "Fire Station",
            type: "way",
        },
        ambulance_station: {
            tag: "amenity",
            label: "Ambulance Station",
            type: "way",
        },
        phone: {
            tag: "emergency",
            label: "Emergency Phone",
            type: "way",
        },
    },

    education: {
        school: {
            tag: "amenity",
            label: "School",
            type: "way",
        },
        college: {
            tag: "amenity",
            label: "College",
            type: "way",
        },      
        university: {
            tag: "amenity",
            label: "University",
            type: "way",
        },  
        library: {
            tag: "amenity",
            label: "Library",
            type: "way",
        },        
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

    shopping: {
        supermarket: {
            tag: "shop",
            label: "Supermarket",
            type: "way",
        },
        convenience: {
            tag: "shop",
            label: "Convenience Store",
            type: "way",
        },
        bakery: {
            tag: "shop",
            label: "Supermarket",
            type: "way",
        },
        butcher: {
            tag: "shop",
            label: "Butcher",
            type: "way",
        },
        greengrocer: {
            tag: "shop",
            label: "Greengrocer",
            type: "way",
        },
        clothes: {
            tag: "shop",
            label: "Clothing",
            type: "way",
        },        
        shoes: {
            tag: "shop",
            label: "Shoes",
            type: "way",
        },
        electronics: {
            tag: "shop",
            label: "Electronics",
            type: "way",
        },
        doityourself: {
            tag: "shop",
            label: "DIY",
            type: "way",
        },
        hardware: {
            tag: "shop",
            label: "Hardware",
            type: "way",
        },
        mall: {
            tag: "shop",
            label: "Mall",
            type: "way",
        },
        department_store: {
            tag: "shop",
            label: "Department Store",
            type: "way",
        },
        kiosk: {
            tag: "shop",
            label: "Kiosk",
            type: "way",
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
            label: "Cafe",
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
            label: "Garden",
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
            label: "Swimming Pool",
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

    tourism: {
        museum: {
            tag: "tourism",
            label: "Museum",
            type: "way",
        },   
        attraction: {
            tag: "tourism",
            label: "Attraction",
            type: "way",
        },
        information: {
            tag: "tourism",
            label: "Information",
            type: "node",
        },
        viewpoint: {
            tag: "tourism",
            label: "Viewpoint",
            type: "node",
        },     
        zoo: {
            tag: "tourism",
            label: "Zoo",
            type: "way",
        },
        aquarium: {
            tag: "tourism",
            label: "Aquarium",
            type: "way",
        },
    },

    accommodation: {
        hotel: {
            tag: "tourism",
            label: "Hotel",
            type: "way",
        },
        hostel: {
            tag: "tourism",
            label: "Hostel",
            type: "way",
        },
        camp_site: {
            tag: "tourism",
            label: "Camp Site",
            type: "way",
        },
        caravan_site: {
            tag: "tourism",
            label: "Caravan Site",
            type: "way",
        },
    },

    landuse: {
        residential: {
            tag: "landuse",
            label: "Residential",
            type: "way"
        },
        commercial: {
            tag: "landuse",
            label: "Commercial",
            type: "way"
        },
        industrial: {
            tag: "landuse",
            label: "Industrial",
            type: "way"
        },
        retail: {
            tag: "landuse",
            label: "Retail",
            type: "way"
        },
        farmland: {
            tag: "landuse",
            label: "Farmland",
            type: "way"
        },
        meadow: {
            tag: "landuse",
            label: "Meadow",
            type: "way"
        },
        orchard: {
            tag: "landuse",
            label: "Orchard",
            type: "way"
        },
        vineyard: {
            tag: "landuse",
            label: "Vineyard",
            type: "way"
        },
        quarry: {
            tag: "landuse",
            label: "Quarry",
            type: "way"
        },
        military: {
            tag: "landuse",
            label: "Military",
            type: "way"
        },
    },

    buildings: {
        residential: {
            tag: "building",
            label: "Residential",
            type: "way"
        },
        house: {
            tag: "building",
            label: "House",
            type: "way"
        },
        apartments: {
            tag: "building",
            label: "Apartments",
            type: "way"
        },
        commercial: {
            tag: "building",
            label: "Commercial",
            type: "way"
        },
        industrial: {
            tag: "building",
            label: "Industrial",
            type: "way"
        },
        retail: {
            tag: "building",
            label: "Retail",
            type: "way"
        },

    },

    naturalFeatures:{
        wood: {
            tag: "natural",
            label: "Woodland",
            type: "way",
        },
        forest: {
            tag: "landuse",
            label: "Forest",
            type: "way",
        },
        grassland: {
            tag: "natural",
            label: "Grassland",
            type: "way",
        },
        beach: {
            tag: "natural",
            label: "Beach",
            type: "way",
        },
        water: {
            tag: "natural",
            label: "Water",
            type: "way",
        },
        river: {
            tag: "waterway",
            label: "River",
            type: "way",
        },
        stream: {
            tag: "waterway",
            label: "Stream",
            type: "way",
        },
        peak: {
            tag: "natural",
            label: "Peak",
            type: "node",
        },
        cliff: {
            tag: "natural",
            label: "Cliff",
            type: "way",
        },
        cave_entrance: {
            tag: "natural",
            label: "Cave",
            type: "node",
        },
    }
};