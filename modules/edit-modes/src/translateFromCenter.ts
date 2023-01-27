import turfCenter from '@turf/center';
import turfRhumbBearing from '@turf/rhumb-bearing';
import turfRhumbDistance from '@turf/rhumb-distance';
import turfRhumbDestination from '@turf/rhumb-destination';
import type {
  Position as TurfPosition,
  Feature as TurfFeature,
  Geometry as TurfGeometry,
} from '@turf/helpers';
import { mapCoords } from './utils';
import type { AnyCoordinates, Position } from './';

// This function takes feature's center, moves it,
// and builds new feature around it keeping the proportions
export function translateFromCenter(
  feature: TurfFeature<TurfGeometry>,
  distance: number,
  direction: number
) {
  const initialCenterPoint = turfCenter(feature as TurfFeature);

  const movedCenterPoint = turfRhumbDestination(initialCenterPoint, distance, direction);

  const movedCoordinates = mapCoords(
    feature.geometry.coordinates as AnyCoordinates,
    (coordinate) => {
      const distance = turfRhumbDistance(
        initialCenterPoint.geometry.coordinates,
        coordinate as TurfPosition
      );
      const direction = turfRhumbBearing(
        initialCenterPoint.geometry.coordinates,
        coordinate as TurfPosition
      );

      const movedPosition = turfRhumbDestination(
        movedCenterPoint.geometry.coordinates,
        distance,
        direction
      ).geometry.coordinates;
      return movedPosition as Position;
    }
  );

  feature.geometry.coordinates = movedCoordinates;

  return feature;
}
