//////////////////////
// IMPORTS
/////////////////////
// libraries
import { observable, action, configure, runInAction } from 'mobx';
import { fetchSlackFiles, ISlackFile, TAsyncStatus } from '../api/slack-api';
// config
configure({ enforceActions: "always" });

//////////////////////∏
// STORE
/////////////////////
export class SlackPhotosStore {
  private MILLIS_IN_WEEK = 604800000;

  // OBSERVABLES
  @observable
  public status: TAsyncStatus = 'idle';

  @observable
  public photos: ISlackFile[] = [];

  @observable
  public startDate: Date = new Date(Date.now() - this.MILLIS_IN_WEEK);

  @observable
  public endDate: Date = new Date();

  // ACTIONS
  @action
  setDates = (dates: [Date | undefined, Date | undefined]) => {
    if (!!dates[0]) {
      this.startDate = dates[0];
    }
    if (!!dates[1]) {
      this.endDate = dates[1];
    }
  }

  @action
  async fetchPhotos(getAllPages?: boolean, channelIds?: string[]) {
    this.photos = [];
    this.status = 'loading';
    try {
      const files = await fetchSlackFiles(this.startDate, this.endDate, getAllPages, channelIds);
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

  // ACTIONS
  @action
  removePhoto = (photoId: string) => {
    const indexToRemove = this.photos.findIndex(p => p.id === photoId);
    this.removePhotoByIndex(indexToRemove);
  }

  @action
  removePhotoByIndex = (index: number) => {
    if (index > -1) {
      this.photos.splice(index, 1);
    }
  }
}