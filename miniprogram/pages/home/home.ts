import ActionSheet, { ActionSheetTheme } from 'tdesign-miniprogram/action-sheet';

Page({
  data: {
    tabBarHeight: 100,
    searchValue: "",
    backTopTheme: 'half-round',
    backTopText: '顶部',
    scrollTop: 0,
    tabBarList: [             // tab-bar 数据示例
      { value: 0, label: '首页', icon: 'home' },
      { value: 1, label: '收藏', icon: 'file-1' },
      { value: 2, label: '我的', icon: 'user' },
    ]

  },
  onLoad: function () {
    this.loadProgramList();  // 页面加载时即获取数据
    const query = this.createSelectorQuery();
    query.select(".t-tab-bar").boundingClientRect().exec(res => {
      console.log(res);
    })
    query.select(".sort").boundingClientRect().exec(res => {
      console.log(res);
    })
    query.select(".search").boundingClientRect().exec(res => {
      console.log(res);
    })
  },

  // 回到顶部相关控制
  onToTop() {
    this.setData({
      backToTopScroll: 0
    });
  },
  onScroll(e: any) {
    this.setData({
      scrollTop: e.detail.scrollTop
    });
  },


  loadProgramList() {
    this.setData({ loading: true });
    console.log("tarBarHeight", this.data.tabBarHeight);
    wx.request({
      url: 'https://1065983258.dpdns.org/api/program/list',
      // url: 'http://127.0.0.1:8000/api/program/list',  // 替换成你的实际接口
      method: 'GET',
      // header: {
      //   'Authorization': 'Bearer ' + wx.getStorageSync('token')  // 如果需要登录态
      // },
      success: (res: any) => {
        if (res.data.code === 200) {
          const originalList = res.data.data || [];
          this.setData({
            programList: originalList,  // 假设返回 { code: 0, data: [...] }
            filteredList: [...originalList],  // 浅拷贝一份用于显示,
            loading: false
          }, () => {
            // console.log(this.data.programList);
          })
        } else {
          wx.showToast({ title: '加载失败', icon: 'none' });
          this.setData({ loading: false });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'none' });
        this.setData({ loading: false });
      }
    });
  },
})
