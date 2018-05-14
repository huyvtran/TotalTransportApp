export class AppConfig {
  //登录用户
  public static LOGIN_USER_NAME: string = 'loginUser';

  //记住密码的用户信息
  public static SAVE_USER_INFO: string = 'saveUserInfo';

  //AppKey
  public static APP_KEY: string = 'TotalLogisticsApp';

  //使用的url
  public static getUrl() {
    // return AppConfig.getDebugUrl();
    return AppConfig.getProdUrl();
  }

  //测试环境URL
  public static getDebugUrl() {
    // return "http://127.0.0.1:8086/cbosAppServer";
    return "http://202.96.124.70:8886/cbosAppServer";
  }

  //生产环境URL
  public static getProdUrl() {
    //正式库直连地址
    return "http://tl.nbport.com.cn:8990/cbosAppServer";
    //统一接口认证地址
    // return "http://app.npedi.com:8083/cbosAppServer";
  }

  //安卓更新地址
  public static getAndroidUpdateUrl() {
    return 'https://www.pgyer.com/YFmr';
  }

  //Ios更新地址
  public static getIosUpdateUrl() {
    return 'https://www.pgyer.com/7mD9';
  }

  //获取设备高度
  public static getWindowHeight() {
    return window.screen.height;
  }

  //获取设备宽度
  public static getWindowWidth() {
    return window.screen.width;
  }
}
