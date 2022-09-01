// index/video.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: 0,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          screenWidth: res.screenWidth,
          halfWidth: res.screenWidth / 2,
        });
      },
    });
    this.getVideoList();
  },

  getVideoList() {
    var that = this;
    wx.request({
      url: app.globalData.urlBase + 'Mobile/Index/getVideoList',
      data: {
        user_id: 242840,
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success(res){
        if (res.data.status == 1000) {
          that.setData({
            list: res.data.data,
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
          });
        }
      }
    });
  },

  goToVideo(e) {
    var video_src =  e.currentTarget.dataset.v_src;
    // 跳转到视频列表页面
    // wx.redirectTo({
    //   url: 'video_detail?video_src=' + video_src,
    // });
    wx.redirectTo({
      url: 'videoInfo?video_src=' + video_src,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})