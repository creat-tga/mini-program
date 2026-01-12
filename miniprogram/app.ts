// app.ts
App<IAppOption>({
  globalData: {},
  onLaunch() {
    // 展示本地存储能力
    const fontWeights = [
      { file: 'ExtraLight', weight: '100' },
      { file: 'Light',      weight: '200' },
      { file: 'Normal',     weight: '300' },  // 或 Regular → 400
      { file: 'Regular',    weight: '400' },
      { file: 'Medium',     weight: '500' },
      { file: 'Bold',       weight: '700' },
      { file: 'Heavy',      weight: '900' },
      // 添加你有的所有权重
    ];

    // fontWeights.forEach(item => {
    //   wx.loadFontFace({
    //     global: true,  // 全局生效
    //     family: 'SourceHanSansSC1',
    //     source: `url("https://1065983258.dpdns.org:8000/static/SimplifiedChinese/SourceHanSansSC-${item.file}.otf")`,
    //     // source: `url("http://127.0.0.1:8000/static/SimplifiedChinese/SourceHanSansSC-${item.file}.otf")`,
    //     desc: {
    //       style: 'normal',
    //       weight: item.weight  // 关键：对应 CSS font-weight 值
    //     },
    //     success(res) {
    //       console.log(`${item.file} 加载成功`, res);
    //     },
    //     fail(err) {
    //       console.error(`${item.file} 加载失败`, err);
    //     }
    //   });
    // });

    // wx.loadFontFace({
    //   global: true,  // 全局生效
    //   family: 'SourceHanSansSC2',
    //   source: `url("https://1065983258.dpdns.org:8000/static/SimplifiedChinese/SourceHanSansSC-VF.otf.woff2")`,

    //   success(res) {
    //     console.log(`SourceHanSansSC-VF.otf.woff2加载成功`, res);
    //   },
    //   fail(err) {
    //     console.error(`SourceHanSansSC-VF.otf.woff2 加载失败`, err);
    //   }
    // });
    wx.loadFontFace({
      global: true,  // 全局生效
      family: 'SourceHanSansSC',
      // source: `url("http://localhost:8000/static/SimplifiedChinese/STXINGKA.TTF")`,
      source: `url("https://1065983258.dpdns.org/static/STXINGKA.TTF")`, 
      // source: `url("https://lf3-static.bytednsdoc.com/obj/eden-cn/89eh7p9v_zlp/ljhwZthlaukjlkulzlp/fonts/SourceHanSansSC-Regular.woff2")`,
      success(res) {
        console.log(`SourceHanSansSC-VF.ttf加载成功`, res);
      },
      fail(err) {
        console.error(`SourceHanSansSC-VF.ttf加载失败`, err);
      }
    });
  
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
})