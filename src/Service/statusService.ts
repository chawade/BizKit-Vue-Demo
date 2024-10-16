interface StatusTheme {
    name: string;
    bgColor: string;
    borderColor: string;
    fontColor: string;
    fontSize: string;
}

type StatusThemeMap = {
    [key: number]: StatusTheme;
};

export default class StatusService {
    private themeMap: StatusThemeMap = {
        // Success (Green variations)
        1500: { name: 'เสร็จสิ้น', bgColor: '#E8F5E9', borderColor: '#4CAF50', fontColor: '#1B5E20', fontSize: '0.875rem' },
        1700: { name: 'แปลงเป็นใบสั่งขาย', bgColor: '#E0F2F1', borderColor: '#009688', fontColor: '#004D40', fontSize: '0.875rem' },
        700: { name: 'ใช้แล้ว', bgColor: '#F1F8E9', borderColor: '#8BC34A', fontColor: '#33691E', fontSize: '0.875rem' },
        250: { name: 'หยิบสินค้าแล้ว', bgColor: '#F9FBE7', borderColor: '#CDDC39', fontColor: '#827717', fontSize: '0.875rem' },
        260: { name: 'วางบิลแล้ว', bgColor: '#FFFDE7', borderColor: '#FFEB3B', fontColor: '#F57F17', fontSize: '0.875rem' },
        300: { name: 'ส่งสินค้าแล้ว', bgColor: '#FFF8E1', borderColor: '#FFC107', fontColor: '#FF6F00', fontSize: '0.875rem' },

        // Info (Blue variations)
        100: { name: 'เช็คในมือ', bgColor: '#E3F2FD', borderColor: '#2196F3', fontColor: '#0D47A1', fontSize: '0.875rem' },
        200: { name: 'เข้าร่วม', bgColor: '#E8EAF6', borderColor: '#3F51B5', fontColor: '#1A237E', fontSize: '0.875rem' },
        120: { name: 'รออนุมัติ', bgColor: '#EDE7F6', borderColor: '#673AB7', fontColor: '#311B92', fontSize: '0.875rem' },
        150: { name: 'วางแผน', bgColor: '#F3E5F5', borderColor: '#9C27B0', fontColor: '#4A148C', fontSize: '0.875rem' },
        550: { name: 'กำลังดำเนินการ', bgColor: '#FCE4EC', borderColor: '#E91E63', fontColor: '#880E4F', fontSize: '0.875rem' },
        350: { name: 'รอเช็คคืน', bgColor: '#FFEBEE', borderColor: '#F44336', fontColor: '#B71C1C', fontSize: '0.875rem' },
        175: { name: 'ระหว่างนับ', bgColor: '#EFEBE9', borderColor: '#795548', fontColor: '#3E2723', fontSize: '0.875rem' },

        // Warn (Yellow/Orange variations)
        400: { name: 'เช็คคืน', bgColor: '#FFF3E0', borderColor: '#FF9800', fontColor: '#E65100', fontSize: '0.875rem' },
        500: { name: 'รอสินค้า', bgColor: '#FBE9E7', borderColor: '#FF5722', fontColor: '#BF360C', fontSize: '0.875rem' },
        270: { name: 'คืนใบแจ้งหนี้แล้ว', bgColor: '#FAFAFA', borderColor: '#9E9E9E', fontColor: '#212121', fontSize: '0.875rem' },
        240: { name: 'มัดจำแล้ว', bgColor: '#ECEFF1', borderColor: '#607D8B', fontColor: '#263238', fontSize: '0.875rem' },
        280: { name: 'มัดจำแล้ว', bgColor: '#E0F7FA', borderColor: '#00BCD4', fontColor: '#006064', fontSize: '0.875rem' },
        900: { name: 'รอมัดจำ', bgColor: '#F1F8E9', borderColor: '#8BC34A', fontColor: '#33691E', fontSize: '0.875rem' },

        // Danger (Red variations)
        800: { name: 'ปฏิเสธ', bgColor: '#FFEBEE', borderColor: '#F44336', fontColor: '#B71C1C', fontSize: '0.875rem' },
        1400: { name: 'ปฏิเสธ', bgColor: '#FFCDD2', borderColor: '#EF5350', fontColor: '#D32F2F', fontSize: '0.875rem' },
        2000: { name: 'ยกเลิก', bgColor: '#EF9A9A', borderColor: '#E57373', fontColor: '#C62828', fontSize: '0.875rem' },
        3000: { name: 'ปิด', bgColor: '#FFCCCB', borderColor: '#FF8A80', fontColor: '#D50000', fontSize: '0.875rem' },
        1000: { name: 'หมดอายุ', bgColor: '#FFE4E1', borderColor: '#FF7043', fontColor: '#D84315', fontSize: '0.875rem' },

    };

    getStatusTheme = (statusId: number): StatusTheme => {
        return this.themeMap[statusId] || { name: 'Unknown', bgColor: '#F5F5F5', borderColor: '#9E9E9E', fontColor: '#212121', fontSize: '0.875rem' };
    };
}

// Usage example:
// const statusService = new StatusService();
// const statusTheme = statusService.getStatusTheme(1500);
// console.log(statusTheme);
// Output: { name: 'เสร็จสิ้น', bgColor: '#E8F5E9', borderColor: '#4CAF50', fontColor: '#1B5E20', fontSize: '0.875rem' }