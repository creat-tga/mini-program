import ActionSheet, { ActionSheetTheme } from 'tdesign-miniprogram/action-sheet';
import { BASE_URL, API } from '../../utils/util';


interface ProgramItem {
  id: number,
  name: string;
  location: string;
  type: string,
  coolingCapacity: number,
  COP: number,
  investReturn: number,
  favorited: number,
  grade: number,
  score: number
}

Page({
  data: {
    programList: [] as ProgramItem[],
    filteredList: [] as ProgramItem[],
    sortKey: "",
    sortOrder: "",
    selectedIndex: -1,  // 选择编辑项目索引, -1代表未选择
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

  onImageError(e:any) {
    console.error('图片加载失败，原因：', e.detail.errMsg);
    // 真机调试时，在 vConsole 面板能看到具体报错，比如 "ERR_CERT_AUTHORITY_INVALID"
  },

  // 页面加载时
  onLoad: function () {
    this.loadProgramList();
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

  // 搜索框相关处理函数, 貌似用不到这么多
  filter(query: any) {
    return this.data.programList.filter((item: any) => {
      return (
        (item.name && item.name.includes(query)) ||
        (item.location && item.location.includes(query)) ||
        (item.type && item.type.includes(query))
      )
    });;
  },

  onSearchChange(e: any) {
    // e.detail.value可以获取查询框的实时数据
    const filtered = this.filter(e.detail.value);
    this.setData({
      searchValue: e.detail.value,
      filteredList: filtered
    })
  },
  // 可选：点击搜索按钮或回车确认时触发（如果你有 action 按钮）
  onSearchConfirm(e: any) {
    this.onSearchChange(e);
  },
  // 清空搜索时触发（t-search 有 clear 事件）
  onSearchClear() {
    this.setData({
      searchValue: '',
      filteredList: this.data.programList
    });
  },

  // 排序相关函数
  onSortChange(e: any) {
    let sortKey = e.currentTarget.dataset.key;
    let sortOrder = "asc";
    if (this.data.sortKey === sortKey) {
      if (this.data.sortOrder === "") {
        sortOrder = "asc"
      } else if (this.data.sortOrder === "asc") {
        sortOrder = "desc"
      } else if (this.data.sortOrder === "desc") {
        sortOrder = "";
      }
    }
    let list = this.filter(this.data.searchValue);

    if (sortOrder !== '') {
      const chineseCollator = new Intl.Collator('zh-CN', {
        sensitivity: 'base',    // 忽略大小写和重音（中文中影响不大，但可统一）
        numeric: true,          // 启用数字自然排序，如 "10" > "2"
        // caseFirst: 'upper',     // 可选：大写优先（通常不影响中文）
      });

      list.sort((a: any, b: any) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];

        // 1. 数字字段特殊处理（冷量、能效等）
        if (sortKey === 'coolingCapacity' || sortKey === 'COP') {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
          return sortOrder === 'asc'
            ? aVal - bVal
            : bVal - aVal;
        }

        // 2. 字符串字段（包括中文）统一转为字符串
        const aStr = (aVal ?? '').toString();
        const bStr = (bVal ?? '').toString();

        // 使用中文 Collator 进行比较
        let compareResult = chineseCollator.compare(aStr, bStr);

        return sortOrder === 'asc' ? compareResult : -compareResult;
      });
    }

    console.log(sortKey, sortOrder);
    this.setData({
      sortKey: sortKey,
      sortOrder: sortOrder,
      filteredList: list
    })
  },

  onShowAction(e: any) {
    const program = this.data.programList.filter(item => item.id === e.currentTarget.dataset.id)[0];
    this.setData({
      selectedIndex: e.currentTarget.dataset.id // 用户选择的索引（-1 为取消）
    })
    if (program?.favorited === 0) {
      ActionSheet.show({
        theme: ActionSheetTheme.List,
        selector: '#t-action-sheet',
        context: this,
        cancelText: '取消',
        items: [
          { label: '删除', icon: 'delete', color: '#E34D59'},
          { label: '收藏', icon: 'bookmark-add', color: 'blue'}
        ],
      });
    } else if (program.favorited === 1) {
      ActionSheet.show({
        theme: ActionSheetTheme.List,
        selector: '#t-action-sheet',
        context: this,
        cancelText: '取消',
        items: [
          { label: '删除', icon: 'delete', color: '#E34D59' },
          { label: '取消收藏', icon: 'bookmark-add', color: 'blue' }
        ],
      });
    }

  },

  handleSelected(e: any) {
    console.log(e);
    if (e.detail.selected.label === "删除") {
      this.deleteItem(this.data.selectedIndex);
    } else if (e.detail.selected.label === "收藏" || e.detail.selected.label === "取消收藏") {
      this.toggleFavorite(this.data.selectedIndex);
    }
  },


  // 删除项目
  deleteItem(id: number) {
    let programList = this.data.programList;
    const program = programList.filter(item => item.id === id);
    if (!program) return;

    wx.showModal({
      title: '确认删除',
      content: `删除后不可恢复，确定要删除【${program[0].name}】吗？`,
      success: (res) => {

        // 确认后先执行后端删除, 后端删除成功之后前端删除
        if (res.confirm) {
          wx.request({
            url: `${BASE_URL}${API.PROGRAM_DELETE}?id=${id}`,  // 替换成你的实际接口
            method: 'GET',
            // header: {
            //   'Authorization': 'Bearer ' + wx.getStorageSync('token')  // 如果需要登录态
            // },
            success: (res: any) => {
              if (res.data.code === 200) {
                if (res.data.data === "删除成功") {
                  let programList = this.data.programList;
                  let filteredList = this.data.filteredList;
                  // 前端删除
                  programList = programList.filter(item => item.id !== id);
                  filteredList = filteredList.filter(item => item.id !== id);
                  this.setData({
                    programList,
                    filteredList
                  });
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                  });
                } else {
                  wx.showToast({ title: '项目不存在, 请刷新重试', icon: 'none' });
                }
              } else {
                wx.showToast({ title: '网络错误, 请刷新重试', icon: 'none' });
              }
            },
            fail: () => {
              wx.showToast({ title: '网络错误, 请刷新重试', icon: 'none' });
            }
          });
        }
      }
    });
  },

  // 切换收藏状态
  toggleFavorite(id: number) {

    let programList = [...this.data.programList];
    let filteredList = [...this.data.filteredList];
    const programListIndex = programList.findIndex(item => item.id === id);
    const program = programList.filter(item => item.id === id);
    if (!program) return;

    wx.request({
      url: `${BASE_URL}${API.PROGRAM_TOGGLE}?id=${id}`,  // 替换成你的实际接口
      method: 'GET',
      // header: {
      //   'Authorization': 'Bearer ' + wx.getStorageSync('token')  // 如果需要登录态
      // },
      success: (res: any) => {

        if (res.data.code === 200) {
          if (res.data.data === "成功") {

            let item = programList[programListIndex];
            if (item.favorited === 0) {
              item.favorited = 1
            } else {
              item.favorited = 0
            }

            this.setData({
              programList: programList,
              filteredList: filteredList
            });
            if (program[0].favorited === 0) {
              wx.showToast({
                title: '收藏成功',
                icon: 'success'
              });
            } else {
              wx.showToast({
                title: '取消收藏成功',
                icon: 'success'
              })
            }

          } else {
            wx.showToast({ title: '项目不存在, 请刷新重试', icon: 'none' });
          }
        } else {
          wx.showToast({ title: '网络错误, 请刷新重试', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误, 请刷新重试', icon: 'none' });
      }
    });
  },

  // 现在是一次性加载所有数据, 如不启用分页, 貌似扛不住1000条的数据展示
  loadProgramList() {
    this.setData({ loading: true });
    console.log("tarBarHeight", this.data.tabBarHeight);
    wx.request({
      url: `${BASE_URL}${API.PROGRAM_LIST}`,
      method: 'GET',
      // header: {
      //   'Authorization': 'Bearer ' + wx.getStorageSync('token')  // 如果需要登录态
      // },
      success: (res: any) => {
        if (res.data.code === 200) {
          let originalList = res.data.data || [];
          originalList = originalList.map((item: any) => {
            return Object.assign({}, item, {
              COP: item.COP != null ? Number(item.COP).toFixed(2) : '-',
              coolingCapacity: item.coolingCapacity != null ? Number(item.coolingCapacity).toFixed(1) : '/',
              investReturn: item.investReturn != null ? Number(item.investReturn).toFixed(1) : '/',
            });
          });
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

  // 点击新建工程按钮
  onCreateNewProject() {
    wx.navigateTo({
      url: '/pages/newProject/newProject',
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
    //   url: '/pages/newProject/newProject', 
    //   success: () => {
    //     console.log('跳转到新建工程页面成功');
    //   },
    //   fail: (err) => {
    //     console.error('跳转失败', err);
    //     wx.showToast({
    //       title: '页面不存在',
    //       icon: 'none'
    //     });
    //   }
    // });
  },

  // 编辑工程信息
  editProgram(e){
    console.log(e);
    wx.navigateTo({
      url: '/pages/newProject/newProject',
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
  },

})
