// components/operateInfo/operateInfo.ts
Component({

  properties: {

  },

  data: {
    date: {
      startDate: '06-01',
      endDate: '09-30',
      temperature: 7.0,
      type: "fixed"
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
  },
  methods: {
    submit() {
      const dateData = { startDate: this.selectComponent('#date').data.startValue, endDate: this.selectComponent('#date').data.endValue }
      const weekData = this.selectComponent('#week').data.elements;
      const hourData = this.selectComponent('#hour').data.elements;
      console.log('最终提交的运行时间：', dateData, weekData, hourData);
      wx.showToast({ title: '提交成功' })
    },
    // 1. 实时输入处理：限制格式、小数位、最大值
    handleInput(e) {
      let { value } = e.detail;

      // ---------------------------------------
      // 第一步：正则清洗，只保留数字和小数点
      // ---------------------------------------
      value = value.replace(/[^\d.]/g, ''); // 去除非数字和非点

      // ---------------------------------------
      // 第二步：处理小数点（保证只有一个，且最多一位小数）
      // ---------------------------------------
      // 如果有多个小数点，只保留第一个
      const dotIndex = value.indexOf('.');
      if (dotIndex !== -1) {
        // 截取到小数点后一位：整数部分 + . + 小数第一位
        const integerPart = value.substring(0, dotIndex);
        const decimalPart = value.substring(dotIndex + 1);

        // 移除多余的小数点，并限制小数位数为1
        let newDecimal = decimalPart.replace(/\./g, '').substring(0, 1);
        value = `${integerPart}.${newDecimal}`;
      }

      // ---------------------------------------
      // 第三步：处理前导 0 (例如 00 -> 0, 05 -> 5)
      // ---------------------------------------
      if (value.length > 1 && value.startsWith('0') && value[1] !== '.') {
        value = parseFloat(value).toString();
      }

      // ---------------------------------------
      // 第四步：数值范围限制 (最大值 40)
      // ---------------------------------------
      const num = parseFloat(value);
      if (!isNaN(num)) {
        if (num > 40) {
          value = '40'; // 超过40强制变为40
          // 如果原本是 40.x 这种情况，也归为 40
        }
      }

      // 更新视图
      this.setData({
        temperature: value
      });
    },

    // 2. 失焦处理：处理最小值 (0, 40] -> 必须大于 0
    handleBlur(e) {
      let { value } = e.detail;
      const num = parseFloat(value);

      // 如果为空，不做处理
      if (!value) return;

      // 逻辑：区间是 (0, 40]，所以 0 是无效的
      if (isNaN(num) || num <= 0) {
        wx.showToast({
          title: '数值必须大于0',
          icon: 'none'
        });
        // 策略：清空或者重置为最小值 0.1
        this.setData({ temperature: '' });
        return;
      }

      // 优化：如果用户输入了 "3." 这种以点结尾的，自动去掉点
      if (value.endsWith('.')) {
        this.setData({
          temperature: value.replace('.', '')
        });
      }
    },
    onChange(e) {
      const { value } = e.detail;
      console.log('用户选择了:', value);
      this.setData({ type: value });
    },

  }
})