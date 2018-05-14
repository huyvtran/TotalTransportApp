import {Injectable} from '@angular/core';
import {JPushService} from 'ionic2-jpush';

/*
  JPush工具
*/
@Injectable()
export class JpushUtilProvider {

  constructor(public jpushService: JPushService) {
    console.log('Hello JpushUtilProvider Provider');
  }

  /**
   * 设置角标
   * @param num
   */
  setBadge(num) {
    this.jpushService.setBadge(num).then(this.finishWork).catch(this.exceptionHHandler);
    this.jpushService.setApplicationIconBadgeNumber(num).then(this.finishWork).catch(this.exceptionHHandler);
  }

  /**
   * 递减角标数量
   */
  reduceBadge() {
    this.jpushService.getApplicationIconBadgeNumber().then(data => {
      let badge = Number(data);
      if (badge <= 0) {
        this.clearBadge();
      } else {
        this.setBadge(Number(data) - 1);
      }
    }).catch(this.exceptionHHandler);
  }

  /**
   * 清空角标数量
   */
  clearBadge() {
    this.setBadge(0);
  }

  private finishWork(data) {
    console.log(data);
  }

  private exceptionHHandler(err) {
    console.log(err);
  }


}
