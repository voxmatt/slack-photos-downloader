//////////////////////
// IMPORTS
/////////////////////
// libraries
import { observable, action, configure, runInAction } from 'mobx';
import { fetchSlackFiles, ISlackFile } from '../api/slack-api';
// config
configure({ enforceActions: "always" });

//////////////////////
// TYPES
/////////////////////
type TSlackChannelsStatus = 'pending' | 'done' | 'error';

//////////////////////∏
// STORE
/////////////////////
export class SlackPhotosStore {
  // OBSERVABLES
  @observable
  public status: TSlackChannelsStatus = 'pending';

  @observable
  public photos: ISlackFile[] = [];

  @action
  async fetchPhotos() {
    this.photos = [];
    this.status = 'pending';
    try {
      const files = await fetchSlackFiles();
      // after await, modifying state again, needs an actions:
      runInAction(() => {
        this.status = "done";
        this.photos = files;
      });
    } catch (error) {
      console.error(error);
      runInAction(() => {
        this.status = "error"
      });
    }
  }
}