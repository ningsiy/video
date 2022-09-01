const app = getApp();
const common = require('../utils/common.js');

Page({
  data: {
    maxDuration: 30, //视频最长30秒
    new_video: '',
    videoList: [],
    uploading_img: '',
    new_images: '',
    showPlayBtn: true,
  },
  onLoad() {
    
  },
  // chooseVedio() {
  //   var that = this;
  //   wx.showActionSheet({
      
  //     success: function (res) {
  //       if (res.tapIndex === 0) {
  //         that.chooseImage(e);
  //       } else {
  //         that.chooseView();
  //       }
  //     }
  //   });
  // },
  chooseVideo() {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      // compressed: false,
      maxDuration: this.data.maxDuration,
      camera: 'back',
      success(res) {
        that.checkVideo(res);
      }
    })
  },
  checkVideo(res) {
    this.uploadView(res.tempFilePath);
    // if (res.size > this.data.maxSize) {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '视频过大，请选择' + this.data.maxSize + 'M内的视频',
    //   });
    //   return false;
    // } else {
    //   this.uploadView(res.tempFilePath);
    // }
  },
  uploadView(tmpPath) {
    console.log(tmpPath);
    wx.showLoading({
      title: '上传中',
    });
    var that = this;
    wx.request({
      url: app.globalData.urlBase + 'Mobile/Index/getAnswerOssSignature',
      data: {
        type: 'video',
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success(res) {
        var aliyunFileKey = '';
        var newUrl = '';
        if (res.data.status === 1000) {
          /* 获取加密信息后上传 */
          const post = res.data.data;
          post.host = that.handeSrcHttps(post.host);
          aliyunFileKey = post.dir + '_miniapp_video_' + that.guid() + '.mp4';
          newUrl = post.host + '/' + aliyunFileKey;
          wx.uploadFile({
            url: post.host,
            filePath: tmpPath,
            name: 'file',
            header: { 'Content-Type': 'multipart/form-data' },
            formData: {
              key: aliyunFileKey,
              OSSAccessKeyId: post.accessid,
              policy: post.policy,
              signature: post.signature,
              success_action_status: '200',
            },
            success() {
              that.setData({
                // new_video: that.data.new_video.concat([newUrl]),
                new_video: newUrl,
              });
              // that.getVideoThumb();
              wx.hideLoading();
            },
          });
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
          });
        }
      },
    });
  },
  // getVideoThumb() {
  //   this.data.videoContext.play();
  //   this.data.videoContext.pause();
  //   this.data.videoContext.stop();
  // },

  chooseImage() {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'], /* 可选择原图或压缩后的图片 */
      sourceType: ['album', 'camera'], /* 可选择性开放访问相册、相机 */
      success(res) {
        wx.showLoading({
          title: '上传中',
        });
        
        that.setData({
          uploading_img: res.tempFilePaths,
        });
        that.upload(that);
        return false;
      },
    });
  },

  /* 上传图片 */
  upload(that) {
    /* 先获取加密信息 */
    wx.request({
      url: app.globalData.urlBase + 'Mobile/Index/getAnswerOssSignature',
      data: {
        type: 'sell_img',
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success(res) {
        var aliyunFileKey = '';
          var curUrl = '';
          var newImageUrl = '';
          if (res.data.status === 1000) {
            /* 获取加密信息后上传 */
            const post = res.data.data;
            post.host = that.handeSrcHttps(post.host);
            aliyunFileKey = post.dir + '_miniapp_' + that.guid() + '.png';
            curUrl = that.data.uploading_img.pop();
            newImageUrl = post.host + '/' + aliyunFileKey;
            wx.uploadFile({
              url: post.host,
              filePath: curUrl,
              name: 'file',
              header: { 'Content-Type': 'multipart/form-data' },
              formData: {
                key: aliyunFileKey,
                OSSAccessKeyId: post.accessid,
                policy: post.policy,
                signature: post.signature,
                success_action_status: '200',
              },
              success() {
                that.setData({
                  new_images: newImageUrl,
                });
                // that.initMoveBox();
                  wx.hideLoading();
              },
            });
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
            });
          }
      },
    });
  },

  submit() {
    var that = this;
    if (that.data.new_video == '') {
      wx.showToast({
        icon: 'none',
        title: '请上传视频',
      });
      return false;
    }
    if (that.data.new_images == '') {
      wx.showToast({
        icon: 'none',
        title: '请上传封面图片',
      });
      return false;
    }
    wx.request({
      url: app.globalData.urlBase + 'Mobile/Index/addVideoInfo',
      data: {
        user_id: 242840,
        vedio: that.data.new_video,
        img: that.data.new_images,
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success(res){
        if (res.data.status == 1000) {
          wx.showToast({
            icon: 'none',
            title: res.data.message,
          });
          // 跳转到视频列表页面
          wx.redirectTo({
            url: 'video_list',
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


  handeSrcHttps(src) {
    if (typeof (src) === 'string') {
      if (src.indexOf('https') === -1) {
        if (src.indexOf('//') === -1) {
          return 'https://' + src;
        }
        return 'https://' + src.split('//')[1];
      }
    }
    return src;
  },

  guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r && 0x3 | 0x8);
      return v.toString(16);
    });
  }
})
