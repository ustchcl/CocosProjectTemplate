const { ccclass, property } = cc._decorator;

@ccclass
export class LoadingScene extends cc.Component {
  @property(cc.Label)
  processLabel: cc.Label = null;
  @property(cc.ProgressBar)
  loadingBar: cc.ProgressBar = null;

  start() {
    cc.director.preloadScene("mainScene", (completedCount, totalCount, item) => {
      console.log(completedCount, totalCount);
      let progress = completedCount / totalCount;
      if (progress > this.loadingBar.progress) {
        this.loadingBar.progress = progress;
        this.processLabel.string = `${(progress * 100).toFixed(2)}%`
      }
    }, (error, asset) => {
      if (error) {
        console.error(error);
        return;
      }
      cc.director.loadScene("mainScene");
    })
  }
}