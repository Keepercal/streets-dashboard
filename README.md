###### v0.3.1-alpha
# Streets Dashboard
This web application is build for transport planners, engineers, or any public or private sector professionals involved with the built environment to search for particular features on streets. 

There are a number of selectable options such as pedestrian crossings and cycle parking, which can be toggled and shown on a map. All data is pulled from OpenStreetMap, an open-source map of the world powered powered by a global community of volunteers, using the Overpass API. This application has been inspired by Overpass Turbo, a web application where you can search OSM features by writing scripts, and is intended to be a userfriendly version that does not require any prior knowledge of scripting.

**NOTE! The data shown within this application is sourced from OpenStreetMap and therefore may not be 100% accurate.**

*Live prototype* 👉 https://keepercal.github.io/healthy-streets-dashboard/
<br>*Overpass API repo* 👉 https://github.com/drolbr/Overpass-API
<br>*Overpass Turbo* 👉 https://overpass-turbo.eu/

## What's new?
### v0.3.1-alpha 

### Added
- Filtering features! When a feature is selected, you can filter the points displayed on the map depending on the tags, such as whether a point is missing a particular tag.

### Changes

- Points on the map are colour coded based on the time since the the specific feature was last edited
- Loaded features are now stored in the cache so they don't have to be reloaded



