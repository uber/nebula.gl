// @flow
import { point } from '@turf/helpers';
import supercluster from 'supercluster';
import HtmlOverlay from './html-overlay';

export default class HtmlClusterOverlay<Props, ObjType> extends HtmlOverlay<Props> {
  _superCluster: Object;
  _lastObjects: ?(ObjType[]) = null;

  getItems(): Object[] {
    // supercluster().load() is expensive and we want to run it only
    // when necessary and not for every frame.
    const newObjects = this.getAllObjects();
    if (newObjects !== this._lastObjects) {
      this._superCluster = supercluster({ maxZoom: 20 });
      this._superCluster.load(
        newObjects.map(object => point(this.getObjectCoordinates(object), { object }))
      );
      this._lastObjects = newObjects;
    }

    const clusters = this._superCluster.getClusters(
      [-180, -90, 180, 90],
      Math.round(this.getZoom())
    );

    return clusters.map(
      ({
        geometry: { coordinates },
        properties: { cluster, point_count: pointCount, cluster_id: clusterId, object }
      }) =>
        cluster
          ? this.renderCluster(coordinates, clusterId, pointCount)
          : this.renderObject(coordinates, object)
    );
  }

  getClusterObjects(clusterId: number): ObjType[] {
    return this._superCluster
      .getLeaves(clusterId, Math.round(this.getZoom()), Infinity)
      .map(object => object.properties.object);
  }

  // Override to provide items that need clustering.
  // If the items have not changed please provide the same array to avoid
  // regeneration of the cluster which causes performance issues.
  getAllObjects(): ObjType[] {
    return [];
  }

  // override to provide coordinates for each object of getAllObjects()
  getObjectCoordinates(obj: ObjType): [number, number] {
    return [0, 0];
  }

  // override to return an HtmlOverlayItem
  renderObject(coordinates: number[], obj: ObjType): ?Object {
    return null;
  }

  // override to return an HtmlOverlayItem
  // use getClusterObjects() to get cluster contents
  renderCluster(coordinates: number[], clusterId: number, pointCount: number): ?Object {
    return null;
  }
}
