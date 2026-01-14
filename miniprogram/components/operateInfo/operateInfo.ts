// components/operateInfo/operateInfo.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    date:{
      startDate: {month: 5, day: 0},
      endDate: {month: 8, day: 30}
    },
    week: [
      { id: 0, label: "一", select: true },
      { id: 1, label: "二", select: true },
      { id: 2, label: "三", select: true },
      { id: 3, label: "四", select: true },
      { id: 4, label: "五", select: true },
      { id: 5, label: "六", select: false },
      { id: 6, label: "日", select: false }
    ],
    hour: [
      { id: 0, label: 0, select: false },
      { id: 1, label: 1, select: false },
      { id: 2, label: 2, select: false },
      { id: 3, label: 3, select: false },
      { id: 4, label: 4, select: false },
      { id: 5, label: 5, select: false },
      { id: 6, label: 6, select: false },
      { id: 7, label: 7, select: false },
      { id: 8, label: 8, select: true },
      { id: 9, label: 9, select: true },
      { id: 10, label: 10, select: true },
      { id: 11, label: 11, select: true },
      { id: 12, label: 12, select: true },
      { id: 13, label: 13, select: true },
      { id: 14, label: 14, select: true },
      { id: 15, label: 15, select: true },
      { id: 16, label: 16, select: true },
      { id: 17, label: 17, select: true },
      { id: 18, label: 18, select: true },
      { id: 19, label: 19, select: false },
      { id: 20, label: 20, select: false },
      { id: 21, label: 21, select: false },
      { id: 22, label: 22, select: false },
      { id: 23, label: 23, select: false }
    ],
    hoursOrigin: [
      { id: 0, select: false },
      { id: 1, select: false },
      { id: 2, select: false },
      { id: 3, select: false },
      { id: 4, select: false },
      { id: 5, select: false },
      { id: 6, select: false },
      { id: 7, select: false },
      { id: 8, select: true },
      { id: 9, select: true },
      { id: 10, select: true },
      { id: 11, select: true },
      { id: 12, select: true },
      { id: 13, select: true },
      { id: 14, select: true },
      { id: 15, select: true },
      { id: 16, select: true },
      { id: 17, select: true },
      { id: 18, select: true },
      { id: 19, select: false },
      { id: 20, select: false },
      { id: 21, select: false },
      { id: 22, select: false },
      { id: 23, select: false }
    ],
    hours: [
      { id: 0, select: false },
      { id: 1, select: false },
      { id: 2, select: false },
      { id: 3, select: false },
      { id: 4, select: false },
      { id: 5, select: false },
      { id: 6, select: false },
      { id: 7, select: false },
      { id: 8, select: true },
      { id: 9, select: true },
      { id: 10, select: true },
      { id: 11, select: true },
      { id: 12, select: true },
      { id: 13, select: true },
      { id: 14, select: true },
      { id: 15, select: true },
      { id: 16, select: true },
      { id: 17, select: true },
      { id: 18, select: true },
      { id: 19, select: false },
      { id: 20, select: false },
      { id: 21, select: false },
      { id: 22, select: false },
      { id: 23, select: false }
    ],
    elementsRects: [],
    startID: -1,
    endID: -1,
    isSelecting: false
  },
  lifetimes: {
    created() {
      this.getElementsRect();
    },
    ready() {
      this.getElementsRect();
    },
  },
  methods: {
    submit() {
      const dateData = null;
      const weekData = this.selectComponent('#week').data.elements;
      const hourData = this.selectComponent('#hour').data.elements;

      console.log('最终提交的星期：', dateData, weekData, hourData);
      wx.showToast({ title: '提交成功' })
    },
    getElementsRect() {
      const query = this.createSelectorQuery().in(this);
      query.selectAll('.hour-wrapper').boundingClientRect(rects => {
        this.setData({
          elementsRects: rects
        })
      }).exec();
    },
    onTouchStart(e: any) {
      console.log("e_start", e.target.id);
      this.getElementsRect();
      // const { clientX, clientY } = e.touches[0];
      // const selectedID = this.findTargetId(clientX, clientY); // getElementsRect方法本质上是异步的
      if (!e.target.id) return;
      const selectedID = e.target.id;
      if (selectedID !== -1) {
        this.setData({
          isSelecting: true,
          startID: selectedID,
          endID: selectedID
        });
        wx.vibrateShort({ type: 'light' });
        this.updateHoursState();
      }
    },
    onTouchMove(e: any) {
      if (!this.data.isSelecting) return;
      const { clientX, clientY } = e.touches[0];
      const selectedID = this.findTargetId(clientX, clientY);
      if (selectedID !== -1 && selectedID !== this.data.endID) {
        this.setData({ endID: selectedID });
        wx.vibrateShort({ type: 'light' });
        this.updateHoursState();
      }
    },
    onTouchEnd() {
      console.log("e_end");
      if (!this.data.isSelecting) return;
      this.setData({ isSelecting: false });
      this.setData({ hoursOrigin: this.data.hours, startID: -1, endID: -1 });
    },
    // 查找逻辑
    findTargetId(x: number, y: number) {
      const rects = this.data.elementsRects;
      const target = rects.find(rect =>
        x >= rect.left && x <= rect.right &&
        y >= rect.top && y <= rect.bottom
      );
      return target ? target.dataset.id : -1;
    },
    // 更新逻辑
    updateHoursState() {
      const hours = [...this.data.hoursOrigin];
      const min = Math.min(this.data.startID, this.data.endID);
      const max = Math.max(this.data.startID, this.data.endID);
      const newHours = hours.map(item => {
        if (item.id >= min && item.id <= max) {
          return { ...item, select: !item.select };
        }
        return item;
      });
      this.setData({ hours: newHours });
    }
  }
})