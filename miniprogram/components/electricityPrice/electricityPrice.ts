// components/electricityPrice/electricityPrice.ts
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
    priceFormat: (v: any) => {
      const isNumber = /^\d+(\.\d+)?$/.test(v);
      if (isNumber) {
        let res = parseFloat(v);
        res = res > 10 ? 10 : res;
        res = res < 0.01 ? 0.01 : res;
        return res.toFixed(2);
      } else {
        return null;
      }
    },
    visible: false,
    options: [
      { label: '居民生活用电', value: '居民生活用电', icon: 'home', tag: '合' },
      // { label: '大工业用电', value: '商业综合体', tag: '合' },
      { label: '一般工商业用电', value: '工业厂房' },
      // { label: '非工业用电', value: '酒店' },
      // { label: '农业用电', value: '医院' },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onElectricityPricePicker(e:any){
      console.log(123456);
      const key = e.currentTarget.dataset.key as PickerKey; // 明确类型
      console.log(key);
      console.log(this.data.visible);
      this.setData({
        visible:true,
      });
    }
  }
})