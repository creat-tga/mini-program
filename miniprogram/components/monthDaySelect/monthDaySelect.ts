// components/monthDaySelect/monthDaySelect.ts
// components/monthDaySelect/monthDaySelect.ts
const MONTHS = Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}月`, value: String(i + 1).padStart(2, '0') }));

Component({
  properties: {
    defaultStart: {
      type: String,
      value: '06-01' 
    },
    defaultEnd: {
      type: String,
      value: '09-30'
    }
  },

  data: {
    visible: false,
    pickerTitle: '',
    currentType: '', 
    
    months: MONTHS,
    days: [], 

    startDisplay: '', 
    endDisplay: '',
    
    startValue: '',   
    endValue: '',     

    pickerValue: [], 
  },

  lifetimes: {
    attached() {
      this.initDefaults();
    }
  },

  methods: {
    initDefaults() {
      const { defaultStart, defaultEnd } = this.properties;

      if (defaultStart) {
        this.setData({
          startValue: defaultStart,
          startDisplay: this.formatDateToDisplay(defaultStart)
        });
      }

      if (defaultEnd) {
        this.setData({
          endValue: defaultEnd,
          endDisplay: this.formatDateToDisplay(defaultEnd)
        });
      }
    },

    formatDateToDisplay(dateStr: string) {
      if (!dateStr) return '';
      const [m, d] = dateStr.split('-');
      return `${parseInt(m, 10)}月${parseInt(d, 10)}日`;
    },

    getDaysByMonth(month: string) {
      const m = parseInt(month, 10);
      // 简单处理非闰年，如果需要严谨逻辑可引入 dayjs 或判断年份
      const daysMap = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const count = daysMap[m];
      
      return Array.from({ length: count }, (_, i) => ({
        label: `${i + 1}日`,
        value: String(i + 1).padStart(2, '0')
      }));
    },

    updateDays(monthValue: string) {
      const days = this.getDaysByMonth(monthValue);
      this.setData({ days });
    },

    openPicker(type: 'start' | 'end') {
      const isStart = type === 'start';
      const currentValue = isStart ? this.data.startValue : this.data.endValue;
      
      let pickerValue = ['06', '01']; 

      if (currentValue) {
        const [m, d] = currentValue.split('-');
        this.updateDays(m);
        pickerValue = [m, d];
      } else {
        this.updateDays('06');
      }

      this.setData({
        visible: true,
        currentType: type,
        pickerTitle: isStart ? '选择开始日期' : '选择结束日期',
        pickerValue: pickerValue
      });
    },

    onOpenStart() { this.openPicker('start'); },
    onOpenEnd() { this.openPicker('end'); },
    onClose() { this.setData({ visible: false }); },

    onColumnChange(e: any) {
      const { column, value } = e.detail;
      if (column === 0) {
        // TDesign 的 picker value 可能是对象或数组，这里假设 value 是选中的值数组
        // 注意：bindpick 返回的 value 可能是选中的索引或值，具体视 TDesign 版本而定
        // 如果 value 是值：
        this.updateDays(value[0]);
      }
    },

    onConfirm(e: any) {
      const { value, label } = e.detail; 
      const dateStr = `${value[0]}-${value[1]}`;
      const displayStr = `${label[0]}${label[1]}`;
      const { currentType, startValue, endValue } = this.data;

      if (currentType === 'start') {
        if (endValue && dateStr > endValue) {
          wx.showToast({ title: '开始日期不能晚于结束日期', icon: 'none' });
          return;
        }
        this.setData({ startValue: dateStr, startDisplay: displayStr, visible: false });
      } else {
        if (startValue && dateStr < startValue) {
          wx.showToast({ title: '结束日期不能早于开始日期', icon: 'none' });
          return;
        }
        this.setData({ endValue: dateStr, endDisplay: displayStr, visible: false });
      }

      this.triggerEvent('change', {
        startDate: currentType === 'start' ? dateStr : startValue,
        endDate: currentType === 'end' ? dateStr : endValue
      });
    }
  }
});