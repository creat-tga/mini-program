// components/monthDaySelect/monthDaySelect.ts
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
    visible: false,
    selectedText: '',           // 显示给用户看的最终结果
    currentValue: null,         // 内部保存 {month, day}

    currentMonthIndex: 0,
    currentDayIndex: 0,

    monthOptions: [],
    dayOptions: []
  },
  lifetimes: {
    ready() {
      this.initOptions();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad() {
      this.initOptions();
    },
    // 初始化月份选项（1~12月）
    initOptions() {
      const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}月`
      }));

      this.setData({
        monthOptions: months
      });

      // 默认选中当前月
      const now = new Date();
      const currentMonth = now.getMonth(); // 0-11
      this.setData({
        currentMonthIndex: currentMonth
      });

      this.updateDays(currentMonth + 1);
    },

    // 根据月份更新天数选项
    updateDays(month) {
      const year = new Date().getFullYear(); // 用当前年判断闰年
      const daysInMonth = new Date(year, month, 0).getDate();

      const days = Array.from({ length: daysInMonth }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}日`
      }));

      this.setData({
        dayOptions: days
      });

      // 如果当前选中的天数超过该月天数，自动调整到最后一天
      const currentDayIndex = this.data.currentDayIndex;
      if (currentDayIndex >= days.length) {
        this.setData({
          currentDayIndex: days.length - 1
        });
      }
    },

    // 月份变更 → 更新天数列
    onMonthChange(e) {
      const monthIndex = e.detail.value;
      const month = this.data.monthOptions[monthIndex].value;

      this.setData({
        currentMonthIndex: monthIndex
      });

      this.updateDays(month);
    },

    // 天数变更
    onDayChange(e) {
      this.setData({
        currentDayIndex: e.detail.value
      });
    },

    // 打开选择器
    showPicker() {
      console.log("打开成功")
      this.setData({ visible: true });
    },

    onClose() {
      this.setData({ visible: false });
    },

    onCancel() {
      this.setData({ visible: false });
    },

    // 确认选择
    onConfirm() {
      const { monthOptions, dayOptions, currentMonthIndex, currentDayIndex } = this.data;

      const month = monthOptions[currentMonthIndex].value;
      const day = dayOptions[currentDayIndex].value;

      const text = `${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日`;

      this.setData({
        visible: false,
        selectedText: text,
        currentValue: { month, day }
      });

      // 你也可以在这里把结果抛出去，比如 triggerEvent
      // this.triggerEvent('change', { month, day, text });
    },

    // 可选：实时变更时也可以更新显示（看需求）
    onChange(e) {
      // 如果想要实时更新显示，可以在这里处理
    }
  }
})