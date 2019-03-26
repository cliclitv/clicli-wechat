import wepy from 'wepy';
export default class utils extends wepy.mixin {
  data = {}
  onLoad() {
    console.log('mixin onshow');
  }
  methods = {
    formatTime(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
    },

    formatTimestampToDate(timestamp) {
      var date = new Date(parseInt(timestamp));
      return date.getFullYear() +
        '-' + (date.getMonth() > 8 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) +
        '-' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
        ' ' + (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) +
        ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()) +
        ':' + (date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds());
    },

    formatNumber(n) {
      n = n.toString();
      return n[1] ? n : '0' + n;
    }
  };
  // 获取积分状态
  getBeanStatus(_isBean) {
    if(!wx.getStorageSync('isBean')) {
      return wx.getStorageSync('isBean')
    }
  }

  GetQueryString(url, key) {
    let strs;
    let theRequest = new Object();
    let str = url.substr(0);
    strs = str.split(key);
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
    }
    return theRequest;
  }
  callback({
    fn,
    params,
    thenFn
  }) {
    let _arguments = arguments;
    wx.showLoading();
    if (thenFn) {
      return this[fn](params).then(res => {
        console.log('callbalk argument', _arguments);
        thenFn(res);
      });
    } else {
      return this[fn](params);
    }
  }
  params(data, word) {
    var params = [];
    for (var key in data) {
      params.push(key + '=' + data[key]);
    }

    var postData = params.join(word);
    console.log(postData);
    if (word == '*') {
      postData = encodeURIComponent(postData);
    }
    return postData;
  }

  request({
    url,
    data = {},
    method
  }) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        method: method,
        header: {
          'Accept': 'application/json',
        },
        success: res => {
          console.log(res);
          if (res.statusCode !== 200) {
            // console.log(res.data.errors);
            for (i of res.data.errors) {
              return wx.showToast({
                title: res.data.errors[i],
                icon: 'none',
                mask: true
              })
            }
            if (res.statusCode >= 500) {
              wx.showToast({
                title: '服务器内部错误',
                icon: 'none',
                duration: 3000
              })
              return
            }
            reject(res.data);
          }
          if (res.data.ret === 1 ||res.data.success) {
            resolve(res.data);
          } else {
            wx.showToast({
              title: res.data.info,
              icon: 'none'
            })
            console.error('error:', res);
            reject(res.data);
          }
        },
        fail: err => {
          console.error('error:', err);
          // for (i of err.data.errors) {
          //   return wx.showToast({
          //     title: err.data.errors[i][0],
          //     icon: 'none',
          //     mask: true
          //   })
          // }
          reject(err.data);
        }
      });
    });
  }
}
