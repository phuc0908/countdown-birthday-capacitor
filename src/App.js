import React, { useState, useEffect } from 'react';
import { Share } from '@capacitor/share';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Device } from '@capacitor/device';
import './App.css';

function App() {
  const [birthdate, setBirthdate] = useState('');
  const [daysLeft, setDaysLeft] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState('Đang kiểm tra...');

  // Khởi tạo Local Notifications
  useEffect(() => {
    LocalNotifications.requestPermissions();
  }, []);

  // Lấy thông tin pin
  useEffect(() => {
    const getBatteryInfo = async () => {
      try {
        const info = await Device.getBatteryInfo();
        if (info.batteryLevel !== undefined) {
          setBatteryLevel(`${Math.round(info.batteryLevel * 100)}%`);
        } else {
          setBatteryLevel('Không khả dụng');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin pin:', error);
        setBatteryLevel('Không khả dụng');
      }
    };
    getBatteryInfo();
  }, []);

  const isValidDate = (dateString) => {
    if (!dateString.match(/^\d{2}\/\d{2}$/)) {
      return false;
    }
  
    const [day, month] = dateString.split('/').map(Number);
    
    // Kiểm tra tháng hợp lệ (1-12)
    if (month < 1 || month > 12) {
      return false;
    }
  
    // Kiểm tra ngày hợp lệ theo tháng
    const daysInMonth = [
      31, // Tháng 1
      (new Date().getFullYear() % 4 === 0) ? 29 : 28, // Tháng 2 (tính cả năm nhuận)
      31, 30, 31, 30, 31, 31, 30, 31, 30, 31 // Các tháng còn lại
    ];
  
    return day > 0 && day <= daysInMonth[month - 1];
  };
  

  const calculateDaysLeft = (date) => {
    const [day, month] = date.split('/').map(Number);
    const today = new Date();
    let nextBirthday = new Date(today.getFullYear(), month - 1, day);

    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = nextBirthday - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleCalculate = async () => {
    if (!birthdate) {
      alert('Vui lòng nhập ngày sinh!');
      return;
    }
    if (!isValidDate(birthdate)) {
      alert('Ngày sinh không hợp lệ! Vui lòng nhập theo định dạng dd/mm và đảm bảo ngày tháng tồn tại');
      return;
    }

    const days = calculateDaysLeft(birthdate);
    setDaysLeft(days);

    // Hiển thị thông báo
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Đếm ngược sinh nhật',
          body: `Còn ${days} ngày đến sinh nhật của bạn!`,
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) },
        }
      ]
    });
  };

  const handleShare = async () => {
    if (daysLeft === null) {
      alert('Vui lòng tính toán số ngày trước khi chia sẻ');
      return;
    }

    try {
      await Share.share({
        title: 'Đếm ngược sinh nhật',
        text: `Còn ${daysLeft} ngày nữa là đến sinh nhật của tôi! 🎉`,
        dialogTitle: 'Chia sẻ đếm ngược sinh nhật'
      });
    } catch (error) {
      alert('Chức năng chia sẻ không khả dụng trên thiết bị này');
    }
  };

  return (
    <div className="app-container">
      <h1>Đếm ngược sinh nhật</h1>
      
      <div className="input-group">
        <input
          type="text"
          placeholder="Nhập ngày sinh (dd/mm)"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className={!birthdate || isValidDate(birthdate) ? '' : 'invalid-input'}
        />
        <button onClick={handleCalculate}>Tính toán</button>
      </div>
      {!birthdate || isValidDate(birthdate) ? null : (
        <p className="error-message">Ngày không hợp lệ! Vui lòng nhập theo định dạng dd/mm</p>
      )}

      {daysLeft !== null && (
        <div className="result">
          <p>Còn <span className="days">{daysLeft}</span> ngày đến sinh nhật tiếp theo!</p>
          <button onClick={handleShare}>Chia sẻ kết quả</button>
        </div>
      )}

      <div className="battery-status">
        <p>Mức pin hiện tại: {batteryLevel}</p>
      </div>
    </div>
  );
}

export default App;