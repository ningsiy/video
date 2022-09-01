App({
  globalData: {
    userInfo: null,
    // urlBase: 'http://zmwapi.com:7800/',
    urlBase:'http://192.168.10.100:7800/'
  },
  onLaunch() {
    
  },
  setGlobalUserInfo: function (user) {
    wx.setStorageSync("userInfo", user);
  },
  getGlobalUserInfo: function () {
    return {
      nickName:'Sawyer'
    }
    return wx.getStorageSync("userInfo");
  },
  saveUserInfo: function (saveUser) {
    wx.setStorageSync("saveUser", saveUser);
  },
  getSaveUserInfo: function () {
    return wx.getStorageSync("saveUser");
  }

})
