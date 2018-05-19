import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {AppConfig} from "../../app/app.config";

/*
  竞价回复
*/
@Injectable()
export class BiddingServiceProvider {

  //封装Header提交表单数据
  private header: Headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  private options: RequestOptions = new RequestOptions({headers: this.header});

  constructor(public http: Http) {
  }

  //竞价信息分页查询
  getOrderEnquiryListByPage(queryParam, page, rows) {
    let url = AppConfig.getUrl() + '/app/bidding/getOrderEnquiryListByPage.do';
    let params = {
      dateStart: queryParam.startDate,
      dateEnd: queryParam.endDate,
      company: queryParam.company,
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

  //查询竞价回复列表
  getOrderEnquiryReplyListById(orderEnquiryId, page, rows) {
    let url = AppConfig.getUrl() + '/app/bidding/getOrderEnquiryReplyListById.do';
    let params = {
      id: orderEnquiryId,
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

  //竞价回复对象
  addBiddingReply(orderEnquiryReply) {
    let url = AppConfig.getUrl() + '/app/bidding/addBiddingReply.do';
    let params = {
      enquiryId: orderEnquiryReply.enquiryId,
      toolMemo: orderEnquiryReply.toolMemo,
      quote: orderEnquiryReply.quote,
      validityPeriod: orderEnquiryReply.validityPeriod,
      memo: orderEnquiryReply.memo,
      replySource: orderEnquiryReply.replySource,
      logisticsProvider: orderEnquiryReply.logisticsProvider,
      providerName: orderEnquiryReply.providerName,
      creator: orderEnquiryReply.creator
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
                orderEnquiry: data.orderEnquiry
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
