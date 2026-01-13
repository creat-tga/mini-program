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
    hoursIsDragging: false,
    elementsRects: [],
    startID: -1,
    endID: -1
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
    getElementsRect() {
      const query = wx.createSelectorQuery().in(this);
      query.selectAll('.hour').boundingClientRect(rects => {
        this.setData({
          elementsRects: rects
        })
      }).exec();
    },

    onTouchStart(e: any) {
      console.log("e_start", e.target.id);
      this.getElementsRect();
      setTimeout(() => {
        this.setData({ isSelecting: true });
        wx.vibrateShort({ type: 'light' }); // 震动反馈
        const { clientX, clientY } = e.touches[0];
        const selectedID = this.data.elementsRects.find(rect =>
          clientY >= rect.top &&
          clientY <= rect.bottom &&
          clientX >= rect.left &&
          clientX <= rect.right
        )?.dataset?.id ?? -1;
        this.setData({ startID: selectedID, endID: selectedID })
      }, 50);
    },
    onTouchMove(e: any) {
      const { clientX, clientY } = e.touches[0];
      const selectedID = this.data.elementsRects.find(rect =>
        clientY >= rect.top &&
        clientY <= rect.bottom &&
        clientX >= rect.left &&
        clientX <= rect.right
      )?.dataset?.id ?? this.data.endID;
      this.setData({ endID: selectedID });
      const hours = [...this.data.hoursOrigin];
      const min = Math.min(this.data.startID, this.data.endID);
      const max = Math.max(this.data.startID, this.data.endID);
      const newHours = hours.map(item => {
        if (item.id >= min && item.id <= max) return { ...item, select: !item.select };
        return item;
      });
      this.setData({ hours: newHours });
    },
    onTouchEnd() {
      console.log("e_end");
      const hours = [...this.data.hoursOrigin];
      const min = Math.min(this.data.startID, this.data.endID);
      const max = Math.max(this.data.startID, this.data.endID);
      const newHours = hours.map(item => {
        if (item.id >= min && item.id <= max) return { ...item, select: !item.select };
        return item;
      });
      this.setData({ hours: newHours, hoursOrigin: newHours });
    },
  }
})