// pages/newProject/newProject.ts

type PickerKey = 'projectType';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    options: [
      { value: 0, label: '单选' },
      { value: 1, label: '单选' },
      { value: 2, label: '单选单选单选单选单选单选单选单选单选单选单选单选单选单选' },
      {
        value: 3,
        label: '单选',
        content: '描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息',
      },
    ],
    priceFormat: (v: any) => {
      const isNumber = /^\d+(\.\d+)?$/.test(v);
      if (isNumber) {
        let res = parseFloat(v);
        res = res > 10000 ? 10000 : res;
        res = res < 1 ? 1 : res;
        return res.toFixed(1);
      } else {
        return null;
      }
    },
    projectType: {
      visible: false,
      title: "请选择工程类型",
      selected: '工业厂房',
      options: [
        { label: '办公楼宇', value: '办公楼宇', icon: 'home', tag: '合' },
        { label: '商业综合体', value: '商业综合体', tag: '合' },
        { label: '工业厂房', value: '工业厂房' },
        { label: '酒店', value: '酒店' },
        { label: '医院', value: '医院' },
      ],
    },
  },
  onChange(e:any) {
    const { value } = e.detail;
    this.setData({ current: value });
  },

  onLoad() {
    const pages = getCurrentPages();  // 获取当前页面栈
    console.log(pages);
  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  },

  handleBack() {

    // wx.navigateBack({
    //   delta: -1,
    //   success: () => {
    //     console.log('跳转到新建工程页面成功')
    //   },
    //   fail: (err) => {
    //     console.error('跳转失败', err);
    //     wx.showToast({
    //       title: '页面不存在',
    //       icon: 'none'
    //     });
    //   }
    // });
    wx.reLaunch({
      url: '/pages/home/home',
      success: () => {
        console.log('跳转到新建工程页面成功');
      },
      fail: (err) => {
        console.error('跳转失败', err);
        wx.showToast({
          title: '页面不存在',
          icon: 'none'
        });
      }
    });
    // wx.switchTab({
    //   url: '/pages/home/home'
    // });
  },

  onTitlePicker(e: any) {
    const key = e.currentTarget.dataset.key as PickerKey; // 明确类型
    console.log(this.data[key].visible);
    this.setData({
      [`${key}.visible`]: true,
    });
  },
  onColumnChange(e: any) {
    console.log('picker pick:', e);
  },
  onPickerChange() {
    console.log(123456);
    this.setData({
    })
  }
})