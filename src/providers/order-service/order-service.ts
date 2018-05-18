import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {AppConfig} from "../../app/app.config";


/*
  订单Service
*/
@Injectable()
export class OrderServiceProvider {
  //封装Header提交表单数据
  private header: Headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  private options: RequestOptions = new RequestOptions({headers: this.header});

  constructor(public http: Http) {
    console.log('Hello OrderServiceProvider Provider');
  }

  getOrderList(order, page, rows) {
    let url = AppConfig.getUrl() + '/app/order/getOrderList.do';
    let params = {
      contractId: order.contractId,
      cargoOwner: order.cargoOwner,
      auditStatus: order.auditStatus,
      page: page,
      rows: rows
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                pager: data.pager
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          console.log(err);
          reject('服务器异常,请检查!');
        })
    });
  }

  getOrderTasks(orderId) {
    let url = AppConfig.getUrl() + '/app/order/getOrderTasks.do';
    let params = {orderId: orderId};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                //水路信息
                taskWaterwayList: data.taskWaterwayList,
                //码头运输信息
                taskWharfList: data.taskWharfList,
                //铁路运输信息
                taskRailwayList: data.taskRailwayList,
                //公路运输信息
                taskHighwayList: data.taskHighwayList
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          console.log(err);
          reject('服务器异常,请检查!');
        })
    });
  }

  getTrackInfo(taskType, taskId) {
    let url = AppConfig.getUrl() + '/app/order/getTrackInfo.do';
    let params = {taskType: taskType, taskId: taskId};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                //物流跟踪信息
                trackList: data.trackList
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          console.log(err);
          reject('服务器异常,请检查!');
        })
    });
  }

  getServiceEvaItem() {
    let url = AppConfig.getUrl() + '/app/order/getServiceEvaItem.do';
    let params = {};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                //服务评价项信息
                itemList: data.itemList
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          console.log(err);
          reject('服务器异常,请检查!');
        })
    });
  }

  confirmOrder(orderId, userId) {
    let url = AppConfig.getUrl() + '/app/order/confirmOrder.do';
    let params = {orderId: orderId, userId: userId};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          console.log(err);
          reject('服务器异常,请检查!');
        })
    });
  }

  /***
   * 订单服务评价
   * @param orderId 订单ID
   * @param itemId 项目json字符串
   * @param starVal 打分json字符串
   * @param serviceInfo 评价描述json字符串
   * @returns {Promise<any>}
   */
  submitServiceEva(userId, orderId, itemId, starVal, serviceInfo) {
    let url = AppConfig.getUrl() + '/app/order/submitServiceEva.do';
    let params = {orderId: orderId, itemId: itemId, starVal: starVal, serviceInfo: serviceInfo};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              resolve(data);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          console.log(err);
          reject('服务器异常,请检查!');
        })
    });
  }

  getOrderDetail(orderId) {
    let url = AppConfig.getUrl() + '/app/order/getOrderDetail.do';
    let params = {orderId: orderId};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                orderId: data.orderId,
                order: data.order,
                //水路信息
                taskWaterwayList: data.taskWaterwayList,
                //码头运输信息
                taskWharfList: data.taskWharfList,
                //铁路运输信息
                taskRailwayList: data.taskRailwayList,
                //公路运输信息
                taskHighwayList: data.taskHighwayList
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          console.log(err);
          reject('服务器异常,请检查!');
        })
    });
  }

  confirmRecive(orderId, userId) {
    let url = AppConfig.getUrl() + '/app/order/confirmRecive.do';
    let params = {orderId: orderId, userId: userId};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          console.log(err);
          reject('服务器异常,请检查!');
        })
    });
  }

  //参数序列化
  private toQueryString(obj) {
    let result = [];
    for (let key in obj) {
      key = encodeURIComponent(key);
      let values = obj[key];
      if (values && values.constructor == Array) {
        let queryValues = [];
        for (let i = 0, len = values.length, value; i < len; i++) {
          value = values[i];
          queryValues.push(this.toQueryPair(key, value));
        }
        result = result.concat(queryValues);
      } else {
        result.push(this.toQueryPair(key, values));
      }
    }
    return result.join('&');
  }

  //参数序列化
  private toQueryPair(key, value) {
    if (typeof value == 'undefined') {
      return key;
    }
    return key + '=' + encodeURIComponent(value === null ? '' : String(value));
  }


}
