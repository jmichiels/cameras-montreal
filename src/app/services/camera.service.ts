import {Injectable} from '@angular/core';
import camerasGeoJson from '@assets/cameras-de-circulation.json';
import {GeoJSON} from 'geojson';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {distinctUntilChanged, first, map, shareReplay} from 'rxjs/operators';

interface CameraData {
  id: number;
  url: string;
  img: string;
  title: string;
  borough: string;
}

const boroughs: { [id: number]: string } = {
  1: 'Ahuntsic-Cartierville',
  3: 'Côte-des-Neiges–Notre-Dame-de-Grâce',
  4: 'Lachine',
  5: 'LaSalle',
  6: 'Le Plateau-Mont-Royal',
  7: 'Le Sud-Ouest',
  8: 'L\'Île-Bizard–Sainte-Geneviève',
  9: 'Mercier–Hochelaga-Maisonneuve',
  10: 'Montréal-Nord',
  11: 'Outremont',
  12: 'Pierrefonds-Roxboro',
  13: 'Rivière-des-Prairies–Pointe-aux-Trembles',
  14: 'Rosemont–La Petite-Patrie',
  15: 'Saint-Laurent',
  16: 'Saint-Léonard',
  17: 'Verdun',
  18: 'Ville-Marie',
  19: 'Villeray–Saint-Michel–Parc-Extension',
};

interface CameraDataMap {
  [id: number]: CameraData;
}

const ID_KEY = 'id-camera';
const URL_KEY = 'url';
const IMG_KEY = 'url-image-en-direct';
const TITLE_KEY = 'titre';
const BOROUGH_ID_KEY = 'id-arrondissement';

const cameraDataMap: CameraDataMap = (camerasGeoJson as GeoJSON.FeatureCollection).features.reduce((acc, feature) => {
  const props = feature.properties!;
  const id = props[ID_KEY];
  acc[id] = {
    id,
    url: props[URL_KEY],
    img: props[IMG_KEY],
    title: props[TITLE_KEY],
    borough: boroughs[props[BOROUGH_ID_KEY]],
  };
  return acc;
}, {} as CameraDataMap);

export interface Camera extends CameraData {
  selected: boolean;
}

const QUERY_IDS_KEY = 'ids';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  // All the cameras.
  cameras$: Observable<Array<Camera>>;
  // Selected cameras, in the same order as in the query parameters.
  selectedCameras$: Observable<Array<Camera>>;

  constructor(
    route: ActivatedRoute,
    private router: Router,
  ) {
    const selectedIds$ = route.queryParams.pipe(
      map(params => (params[QUERY_IDS_KEY] as string)?.split(',').map(str => +str) ?? []),
      distinctUntilChanged(),
      shareReplay(1),
    );
    this.cameras$ = selectedIds$.pipe(
      map(selectedIds => Object.values(cameraDataMap).map(cameraData => ({
        ...cameraData,
        selected: selectedIds.includes(cameraData.id),
      }))),
      shareReplay(1),
    );
    this.selectedCameras$ = selectedIds$.pipe(
      map(selectedIds => selectedIds.reduce((acc, id) => {
        const camera = cameraDataMap[id];
        if (camera) {
          acc.push({
            ...camera,
            selected: true,
          });
        } else {
          console.error(`camera ${id} not found`);
        }
        return acc;
      }, [] as Array<Camera>)),
      shareReplay(1),
    );
  }

  async select(id: number): Promise<boolean> {
    return this.setSelected([id, ...await this.getSelected()]);
  }

  async unselect(id: number): Promise<boolean> {
    return this.setSelected((await this.getSelected()).filter(
      selectedId => id !== selectedId
    ));
  }

  raise(id: number): Promise<boolean> {
    return this.moveSelected(id, -1);
  }

  lower(id: number): Promise<boolean> {
    return this.moveSelected(id, +1);
  }

  private async moveSelected(id: number, offset: number): Promise<boolean> {
    const ids = await this.getSelected();
    const index = ids.indexOf(id);
    [ids[index], ids[index + offset]] = [ids[index + offset], ids[index]];
    return this.setSelected(ids);
  }

  private getSelected(): Promise<Array<number>> {
    return this.selectedCameras$.pipe(
      map(cameras => cameras.map(camera => camera.id)),
      first(),
    ).toPromise();
  }

  private setSelected(ids: Array<number>): Promise<boolean> {
    return this.router.navigate([''], {
      queryParams: {
        [QUERY_IDS_KEY]: ids.join(','),
      },
    });
  }
}
