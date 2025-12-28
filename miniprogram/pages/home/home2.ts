import ActionSheet, { ActionSheetTheme } from 'tdesign-miniprogram/action-sheet';

Component({
  lifetimes: {
    attached() {
      // 组件被插入页面时调用（相当于 Page 的 onLoad / onShow）
      this.loadProgramList();
    }
  },

  data: {
    headerHeight: 200, // 搜索 + 排序区域的大致高度（可通过 onReady 中实际测量更准）
    tabBarHeight: 100, // 默认值，后面会动态替换
    safeAreaBottom: 0,
    refresherTriggered: false,
    programList: [],    // 卡片数据数组
    filteredList: [],      // 筛选后的列表（显示用）
    searchValue: '',       // 搜索框当前值
    sortKey: "",  // 排序对象
    sortOrder: "",  // 顺序
    loading: true,      // 加载状态
    value: 0,           // tab-bar 当前选中（根据你的需求）
    backTopTheme: 'round',
    backTopText: '顶部',
    scrollTop: 0,
    backToTopScroll: 0,        // 新增：专门用于控制返回顶部
    // actionVisible: true,
    list: [             // tab-bar 数据示例
      { value: 0, label: '首页', icon: 'home' },
      { value: 1, label: '收藏', icon: 'file-1' },
      { value: 2, label: '我的', icon: 'user' },
    ]
  },


  methods: {
    // 搜索框输入时触发（推荐用这个，实时搜索）
    onSearchChange(e: any) {
      const value = e.detail.value.trim();
      this.setData({
        searchValue: value
      });

      if (!value) {
        // 搜索为空时显示全部
        this.setData({
          filteredList: this.data.programList
        });
        return;
      }

      // 筛选逻辑：根据多个字段模糊匹配
      const filtered = this.data.programList.filter((item: any) => {
        return (
          (item.name && item.name.includes(value)) ||
          (item.location && item.location.includes(value)) ||
          (item.type && item.type.includes(value)) ||
          // 添加更多你想搜索的字段，例如：
          // (item.manager && item.manager.includes(value))
          false // 防止空过滤
        );
      });

      this.setData({
        filteredList: filtered
      });
    },

    // 可选：点击搜索按钮或回车确认时触发（如果你有 action 按钮）
    onSearchConfirm(e: any) {
      // 可以和 change 共用逻辑，或在这里额外处理
      this.onSearchChange(e);
    },

    // 清空搜索时触发（t-search 有 clear 事件）
    onSearchClear() {
      this.setData({
        searchValue: '',
        filteredList: this.data.programList
      });
    },
    onChange(e: any) {
      this.setData({
        value: e.detail.value,
      });
    },
    onToTop() {
      // 关键：把控制滚动的变量设为 0
      this.setData({
        backToTopScroll: 0
      });
    },
    onScroll(e: any) {
      this.setData({
        scrollTop: e.detail.scrollTop
      });
    },
    calculateHeights() {
      const that = this;
      wx.getSystemInfo({
        success(res) {
          const { safeArea, screenHeight, statusBarHeight, windowHeight } = res;
          let tabBarHeight = 100; // 普通设备默认
          let safeAreaBottom = 0;

          // 也可以通过创建选择器查询实际 tab-bar 高度（更准确）
          const query = wx.createSelectorQuery();
          query.select('.t-tab-bar')  // 或你的元素选择器
            .fields({
              computedStyle: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left']
            }, (res) => {
              if (res) {
                console.log(res);
                console.log(2);
                console.log('margin-top:', res['margin-top']);     // 如 '10px'
                console.log('margin-right:', res['margin-right']);
                console.log('margin-bottom:', res['margin-bottom']);
                console.log('margin-left:', res['margin-left']);
              }
            })
            .exec();
          query
            // .select('.t-tab-bar')
            // .boundingClientRect()
            .select('.sort')
            .boundingClientRect()
            .exec(res => {
              // res[0] 是 .t-tab-bar 的 rect
              // res[1] 是 .search 的 rect
              console.log(res);
              console.log('t-tab-bar rect:', res[0]);
              console.log('search rect:', res[1]);

              let tabBarHeight = 0;
              let searchHeight = 0;
              let safeAreaBottom = 0;

              if (res[0]) {
                tabBarHeight = res[0].height * 2; // px → rpx（近似，实际更准见下方说明）
                safeAreaBottom = tabBarHeight > 120 ? (tabBarHeight - 100) : 0;
              }

              if (res[1]) {
                searchHeight = res[1].height * 2;
              }

              console.log('tabBarHeight (rpx):', tabBarHeight);
              console.log('searchHeight (rpx):', searchHeight);
              console.log('safeAreaBottom:', safeAreaBottom);

              that.setData({
                tabBarHeight: tabBarHeight,
                safeAreaBottom: safeAreaBottom,
                // searchHeight: searchHeight
              });
            });



          // query.select('.t-tab-bar').boundingClientRect();
          // query.exec(rect => {
          //   if (rect && rect[0]) {
          //     tabBarHeight = rect[0].height * 2; // px 转 rpx
          //     safeAreaBottom = tabBarHeight > 120 ? (tabBarHeight - 100) : 0;
          //     console.log(123456)
          //   }
          //   console.log("tabBarHeight", safeAreaBottom);
          //   that.setData({
          //     tabBarHeight: tabBarHeight
          //   });
          // });
          // query.select('.search').boundingClientRect();
          // query.exec(rect => {
          //   if (rect && rect[0]) {
          //     tabBarHeight = rect[0].height * 2; // px 转 rpx
          //   }
          //   console.log("search", tabBarHeight);
          //   // that.setData({
          //   //   tabBarHeight: safeAreaBottom,
          //   // });
          // });

        }
      });
    },

    loadProgramList() {
      this.calculateHeights();
      this.setData({ loading: true });
      console.log("tarBarHeight", this.data.tabBarHeight);
      wx.request({
        url: 'https://1065983258.dpdns.org/api/program/list',
        // url: 'http://[2409:8a55:f1cf:bca0:6ddf:539b:b2d9:4010]:8000/api/program/list',  // 替换成你的实际接口

        // url: 'http://127.0.0.1:8000/api/program/list',  // 替换成你的实际接口
        method: 'GET',
        // header: {
        //   'Authorization': 'Bearer ' + wx.getStorageSync('token')  // 如果需要登录态
        // },
        success: (res: any) => {
          if (res.data.code === 200) {
            const originalList = res.data.data || [];
            const a = [...originalList];
            this.setData({
              programList: originalList,  // 假设返回 { code: 0, data: [...] }
              filteredList: a,  // 明确浅拷贝一份用于显示,
              loading: false
            }, () => {
              console.log(12);
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

    onSortChange(e: any) {
      const key = e.currentTarget.dataset.key;
      let order = 'asc';
      if (this.data.sortKey === key && this.data.sortOrder === '') {
        order = 'asc';  // 降序点击后取消排序
      }
      if (this.data.sortKey === key && this.data.sortOrder === 'asc') {
        order = 'desc';  // 再次点击切换为降序
      }
      if (this.data.sortKey === key && this.data.sortOrder === 'desc') {
        order = '';  // 降序点击后取消排序
      }
      this.setData({
        sortKey: key,
        sortOrder: order
      });

      this.applySortAndFilter();
    },

    // 统一处理：搜索 + 排序 后的结果
    applySortAndFilter() {
      let list = [...this.data.programList];  // 复制原始数据
      // 1. 先搜索过滤
      const value = this.data.searchValue.trim();
      if (value) {
        list = list.filter((item: any) => {
          return (
            (item.name && item.name.includes(value)) ||
            (item.location && item.location.includes(value)) ||
            (item.type && item.type.includes(value)) ||
            (item.coolingCapacity && item.coolingCapacity.toString().includes(value)) ||
            (item.COP && item.COP.toString().includes(value))
          );
        });
      }

      // 2. 再排序
      if (this.data.sortKey) {
        list.sort((a: any, b: any) => {
          let aVal = a[this.data.sortKey];
          let bVal = b[this.data.sortKey];

          // 处理数字字段（冷量、能效）
          if (this.data.sortKey === 'coolingCapacity' || this.data.sortKey === 'COP') {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
          } else {
            // 字符串处理：空值排后，中英文兼容
            aVal = (aVal || '').toString().toLowerCase();
            bVal = (bVal || '').toString().toLowerCase();
          }

          if (this.data.sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }
      this.setData({
        filteredList: list
      });

      if (this.data.sortOrder === "") {
        this.setData({
          filteredList: [...this.data.programList]
        });
      }
    },

    // 选择菜单项
    onShowAction(e: any) {
      this.setData({
        selectedIndex: e.currentTarget.dataset.id // 用户选择的索引（-1 为取消）
      })
      ActionSheet.show({
        theme: ActionSheetTheme.List,
        selector: '#t-action-sheet',
        context: this,
        cancelText: 'cancel',
        items: ['删除', 'Mark as important', 'Unsubscribe', 'Add to Tasks'],
      });
    },

    handleSelected(e: any) {
      if (e.detail.selected === "删除") {
        this.deleteItem(this.data.selectedIndex);
      }
    },

    // 切换收藏状态（前端模拟，实际项目需调用接口）
    toggleFavorite(id, listIndex) {
      const programList = this.data.programList;
      const filteredList = this.data.filteredList;

      // 更新原始列表
      const programItem = programList.find(item => item.id === id);
      if (programItem) {
        programItem.favorited = !programItem.favorited;
      }

      // 更新过滤列表（如果在当前显示中）
      if (filteredList[listIndex]) {
        filteredList[listIndex].favorited = programItem.favorited;
      }

      this.setData({
        programList: [...programList],  // 触发更新
        filteredList: [...filteredList]
      });

      wx.showToast({
        title: programItem.favorited ? '已收藏' : '已取消收藏',
        icon: 'success'
      });
    },

    // 删除卡片（前端模拟，实际需调用删除接口）
    deleteItem(id: number) {
      wx.showModal({
        title: '确认删除',
        content: '删除后不可恢复，确定要删除此工程吗？',
        success: (res) => {
          if (res.confirm) {
            let programList = this.data.programList;
            let filteredList = this.data.filteredList;

            // 从原始列表移除
            programList = programList.filter(item => item.id !== id);

            // 从当前显示列表移除
            filteredList = filteredList.filter(item => item.id !== id);

            this.setData({
              programList,
              filteredList
            });

            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
          }
        }
      });
    },
  },


});

