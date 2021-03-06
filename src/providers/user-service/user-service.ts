import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {AppConfig} from "../../app/app.config";

/*
 用户Service
 */
@Injectable()
export class UserServiceProvider {
  //封装Header提交表单数据
  private header: Headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  private options: RequestOptions = new RequestOptions({headers: this.header});

  constructor(public http: Http) {
  }

  //登录
  login(account, password) {
    let url = AppConfig.getUrl() + '/app/user/login.do';
    let params = {account: account, password: password};
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

  /**
   * 验证账户是否存在
   * @param account
   * @returns {Promise<any>}
   */
  checkAccount(account) {
    let url = AppConfig.getUrl() + '/app/user/checkAccount.do';
    let params = {account: account};
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
                //库内是否已存在该账号 true存在 false不存在
                isExist: data.isExist
              };
              resolve(result);
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

  userRegist(user) {
    let url = AppConfig.getUrl() + '/app/user/userRegist.do';
    let params = {
      account: user.account,
      password: user.password,
      userName: user.nickname,
      mobil: user.phone
    };
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
                message: data.message
              };
              resolve(result);
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

  //修改密码
  updatePassword(userId, oldPassword, newPassword) {
    let url = AppConfig.getUrl() + '/app/user/updatePassword.do';
    let params = {userId: userId, oldPassword: oldPassword, newPassword: newPassword};
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

  getUserByMobile(phone) {
    let url = AppConfig.getUrl() + '/app/user/getUserByMobile.do';
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
                user: data.user
              };
              resolve(result);
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

  resetPwd(userId, password) {
    let url = AppConfig.getUrl() + '/app/user/passwordSet.do';
    let params = {userId: userId, newPassword: password};
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
                message: data.message
              };
              resolve(result);
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

  updatePhone(userId, phone) {
    let url = AppConfig.getUrl() + '/app/user/updatePhone.do';
    let params = {userId: userId, mobil: phone};
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
                message: data.message
              };
              resolve(result);
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

  //修改信息
  saveUser(user) {
    let url = AppConfig.getUrl() + '/app/user/saveUser.do';
    let params = {
      id: user.id,
      userName: user.userName,
      sex: user.sex,
      deptId: user.deptId,
      // company: user.company,
      mail: user.mail
    };
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

  //修改用户的推送ID
  updateJpushRegistrationId(userId, jpushRegistrationId) {
    let url = AppConfig.getUrl() + '/app/user/updatePushId.do';
    let params = {userId: userId, jPushRegistrationId: jpushRegistrationId};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'fail') {
              reject(data.message);
            } else {
              resolve(data);
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

  //清空用户的推送ID
  clearJpushRegistrationId(userId) {
    let url = AppConfig.getUrl() + '/app/user/emptyPushId.do';
    let params = {userId: userId};
    return new Promise((resolve, reject) => {
      this.http.post(url, this.toQueryString(params), this.options)
        .map(res => res.json())
        .subscribe(data => {
          if (Boolean(data)) {
            if (data.result == 'fail') {
              reject(data.message);
            } else {
              resolve(data);
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
