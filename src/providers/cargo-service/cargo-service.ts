import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {AppConfig} from "../../app/app.config";

/*
  货盘Service
*/
@Injectable()
export class CargoServiceProvider {
  //封装Header提交表单数据
  private header: Headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  private options: RequestOptions = new RequestOptions({headers: this.header});

  constructor(public http: Http) {
  }

  //货盘信息分页查询
  getCargoInfoListByPage(queryParam, page, rows) {
    let url = AppConfig.getUrl() + '/app/cargoInfo/getCargoInfoListByPage.do';
    let params = {
      startPort: queryParam.startPlace,
      endPort: queryParam.endPlace,
      dateStart: queryParam.startDate,
      dateEnd: queryParam.endDate,
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

  //货盘详情查询
  getCargoInfoById(id) {
    let url = AppConfig.getUrl() + '/app/cargoInfo/getCargoInfoById.do';
    let params = {id: id};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                cargoInfo: data.cargoInfo
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

