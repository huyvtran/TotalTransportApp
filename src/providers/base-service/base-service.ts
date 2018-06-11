import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {AppConfig} from "../../app/app.config";

/*
  基础Service
*/
@Injectable()
export class BaseServiceProvider {

  //封装Header提交表单数据
  private header: Headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  private options: RequestOptions = new RequestOptions({headers: this.header});

  constructor(public http: Http) {
    console.log('Hello BaseServiceProvider Provider');
  }

  /**
   * 发送手机验证码
   * @param phone
   * @returns {Promise<any>}
   */
  sendAuthCode(phone) {
    let url = AppConfig.getUrl() + '/app/phoneMessage/sendMsg.do';
    let params = {phone: phone};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'fail') {
              reject(data.message);
            } else {
              let result = {
                result: data.result,
                message: data.message,
                //手机号
                phone: data.phone,
                //验证码
                authCode: data.authCode
              };
              resolve(result);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          console.log(err);
          reject('网络连接超时,请检查!');
        })
    });
  }

  /**
   * 检查手机号是否存在
   * @param phone
   * @returns {Promise<any>}
   */
  checkPhone(phone) {
    let url = AppConfig.getUrl() + '/app/phoneMessage/checkPhone.do';
    let params = {phone: phone};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'fail') {
              reject(data.message);
            } else {
              let result = {
                result: data.result,
                message: data.message,
                //库内是否已存在该手机号 true存在 false不存在
                isExist: data.isExist
              };
              resolve(result);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          console.log(err);
          reject('网络连接超时,请检查!');
        })
    });
  }

  /**
   * 基础货名列表
   * @returns {Promise<any>}
   */
  getBaseCargoList() {
    let url = AppConfig.getUrl() + '/app/baseCargo/getBaseCargoList.do';
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                baseCargoList: data.baseCargoList
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          reject(err);
        });
    });
  }

  /**
   * 起始地目的地数据
   * @returns {Promise<any>}
   */
  getBasePlaceList() {
    let url = AppConfig.getUrl() + '/app/basePlace/getBasePlaceList.do';
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                basePlaceList: data.basePlaceList
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          reject(err);
        });
    });
  }

  /**
   * 基础港口数据
   * @returns {Promise<any>}
   */
  getBasePortList() {
    let url = AppConfig.getUrl() + '/app/basePort/getBasePortList.do';
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                basePortList: data.basePortList
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          reject(err);
        });
    });
  }

  getBasePortListByPage(queryParam, page, rows) {
    let url = AppConfig.getUrl() + '/app/basePort/getBasePortListByPage.do';
    let params = {
      portName: queryParam.portName,
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

  /**
   * 基础货类列表
   * @returns {Promise<any>}
   */
  getBaseCargoTypeList() {
    let url = AppConfig.getUrl() + '/app/baseCargoType/getBaseCargoTypeList.do';
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                baseCargoTypeList: data.baseCargoTypeList
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          reject(err);
        });
    });
  }

  /**
   * 基础数量单位列表
   * @returns {Promise<any>}
   */
  getBaseItemListByUnit() {
    let url = AppConfig.getUrl() + '/app/baseItem/getBaseItemListByUnit.do';
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                baseItemList: data.baseItemList
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          reject(err);
        });
    });
  }

  /**
   * 基础工作单位列表
   * @returns {Promise<any>}
   */
  getBaseCompanyList() {
    let url = AppConfig.getUrl() + '/app/user/getBaseCompanyList.do';
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                companyList: data.companyList
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          reject(err);
        });
    });
  }

  /**
   * 部门列表
   * @returns {Promise<any>}
   */
  getSysDeptList() {
    let url = AppConfig.getUrl() + '/app/user/getSysDeptList.do';
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'success') {
              let result = {
                result: data.result,
                message: data.message,
                sysDeptList: data.sysDeptList
              };
              resolve(result);
            } else {
              reject(data.message);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          reject(err);
        });
    });
  }

  //获取最新版本
  getLastestVersion() {
    let url = AppConfig.getUrl() + '/app/version/getLastestVersion.do';
    let params = {appKey: AppConfig.APP_KEY};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'fail') {
              reject(data.message);
            } else {
              let result = {
                result: data.result,
                message: data.message,
                appVersionHistory: data.appVersionHistory
              };
              resolve(result);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          console.log(err);
          reject('网络连接超时,请检查!');
        })
    });
  }

  /**
   * 查询基础船舶信息
   * @param vesselId
   * @returns {Promise<any>}
   */
  queryVesselInfo(vesselId) {
    let url = AppConfig.getUrl() + '/app/baseVessel/queryVesselInfo.do';
    let params = {vesselId: vesselId};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'fail') {
              reject(data.message);
            } else {
              let result = {
                result: data.result,
                message: data.message,
                baseVessel: data.baseVessel
              };
              resolve(result);
            }
          } else {
            reject('服务器未响应');
          }
        }, err => {
          console.log(err);
          reject('网络连接超时,请检查!');
        })
    });
  }

  // get(url) {
  //   return new Promise((resolve, reject) => {
  //     this.http.get(url)
  //       .map(res => res.json())
  //       .subscribe(data => {
  //         resolve(data);
  //       }, err => {
  //         reject(err);
  //       });
  //   });
  // }

  // post(url, paramObj) {
  //   let header = new Headers({
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   });
  //   // header.append('Content-Type', 'application/x-www-form-urlencoded');
  //   // header.append('Access-Control-Allow-Origin', '*');
  //   // header.append('Access-Control-Allow-Headers', 'Authentication');
  //   let options = new RequestOptions({headers: header});
  //   let param = this.toQueryString(paramObj);
  //   console.log("param:" + param);
  //   return new Promise((resolve, reject) => {
  //     this.http.post(url, param, options)
  //       .map(res => res.json())
  //       .subscribe(data => {
  //         console.log(data);
  //         if (Boolean(data)) {
  //           resolve(data);
  //         } else {
  //           reject('服务器未响应');
  //         }
  //       }, err => {
  //         console.log(err);
  //         reject(err);
  //       })
  //   });
  // }

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
