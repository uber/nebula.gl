import { point } from '@turf/helpers';
import Supercluster from 'supercluster';
import HtmlOverlay from './html-overlay';

export default class HtmlClusterOverlay<ObjType> extends HtmlOverlay {
  _superCluster: Record<string, any>;
  _lastObjects: ObjType[] | null | undefined = null;

  getItems(): Record<string, any>[] {
    // supercluster().load() is expensive and we want to run it only
    // when necessary and not for every frame.

    // TODO: Warn if this is running many times / sec

    const newObjects = this.getAllObjects();
    if (newObjects !== this._lastObjects) {
      this._superCluster = new Supercluster(this.getClusterOptions());
      this._superCluster.load(
        newObjects.map((object) => point(this.getObjectCoordinates(object), { object }))
      );
      this._lastObjects = newObjects;
      // console.log('new Supercluster() run');
    }

    const clusters = this._superCluster.getClusters(
      [-180, -90, 180, 90],
      Math.round(this.getZoom())
    );

    return clusters.map(
      ({
        geometry: { coordinates },
        properties: { cluster, point_count: pointCount, cluster_id: clusterId, object },
      }) =>
        cluster
          ? this.renderCluster(coordinates, clusterId, pointCount)
          : this.renderObject(coordinates, object)
    );
  }

  getClusterObjects(clusterId: number): ObjType[] {
    return this._superCluster
      .getLeaves(clusterId, Infinity)
      .map((object) => object.properties.object);
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

  // Get options object used when instantiating supercluster
  getClusterOptions(): Record<string, any> | null | undefined {
    return {
      maxZoom: 20,
    };
  }

  // override to return an HtmlOverlayItem
  renderObject(coordinates: number[], obj: ObjType): Record<string, any> | null | undefined {
    return null;
  }

  // override to return an HtmlOverlayItem
  // use getClusterObjects() to get cluster contents
  renderCluster(
    coordinates: number[],
    clusterId: number,
    pointCount: number
  ): Record<string, any> | null | undefined {
    return null;
  }
}
