// components/moveSelecte/moveSelecte.ts

interface Element {
  id: number;
  label: string | number;
  select: boolean;
}

Component({

  properties: {
    elements: {
      type: Array,
      value: [] as Element[]
    },
  },

  data: {
    elementsOrigin:[] as Element[],
    elements: [] as Element[],
    elementsRects: [] as WechatMiniprogram.BoundingClientRectCallbackResult[],
    startID: -1,
    endID: -1,
    isSelecting: false
  },
  lifetimes: {
    created() {
      this.getElementsRect();
    },
    ready() {
      this.data.elementsOrigin = this.properties.elements;
      this.data.elements = [...this.data.elementsOrigin];
      this.getElementsRect();
    },
  },
  methods: {
    getMyData() {
      this.triggerEvent('getData', {
        data: this.data
      })
    },
    sendAllData() {
      this.triggerEvent('getData', {
        data: this.data,          
        msg: '这是子组件的完整数据～'
      })
    },
    getElementsRect() {
      const query = this.createSelectorQuery().in(this);
      query.selectAll('.element-wrapper').boundingClientRect(rects => {
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
        this.updateelementsState();
      }
    },
    onTouchMove(e: any) {
      if (!this.data.isSelecting) return;
      const { clientX, clientY } = e.touches[0];
      const selectedID = this.findTargetId(clientX, clientY);
      if (selectedID !== -1 && selectedID !== this.data.endID) {
        this.setData({ endID: selectedID });
        wx.vibrateShort({ type: 'light' });
        this.updateelementsState();
      }
    },
    onTouchEnd() {
      console.log("e_end");
      if (!this.data.isSelecting) return;
      this.setData({ isSelecting: false });
      this.setData({ elementsOrigin: this.data.elements, startID: -1, endID: -1 });
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
    updateelementsState() {
      const elements = [...this.data.elementsOrigin];
      const min = Math.min(this.data.startID, this.data.endID);
      const max = Math.max(this.data.startID, this.data.endID);
      const newelements = elements.map(item => {
        if (item.id >= min && item.id <= max) {
          return { ...item, select: !item.select };
        }
        return item;
      });
      this.setData({ elements: newelements });
    }
  }
})