export default class AppConfig {
    static ACCESS_TOKEN = '';

    static USER_ID = '';

    static USER_OBJ = {};

    // Quản lý xe tập trung
    static VEHICLES = [
        {
            id: 1,
            brand: 'Mitsubishi',
            model: 'Xpander',
            licensePlate: '30A-12345',
            year: '2022',
            color: 'Trắng',
            mileage: '25,000 km',
            fuelType: 'Xăng',
            status: 'Hoạt động',
            lastService: '15/10/2024',
            nextService: '15/01/2025',
        },
        {
            id: 2,
            brand: 'Toyota',
            model: 'Vios',
            licensePlate: '30B-67890',
            year: '2021',
            color: 'Đen',
            mileage: '32,000 km',
            fuelType: 'Xăng',
            status: 'Hoạt động',
            lastService: '20/09/2024',
            nextService: '20/12/2024',
        },
        {
            id: 3,
            brand: 'Honda',
            model: 'City',
            licensePlate: '30C-11111',
            year: '2023',
            color: 'Xanh',
            mileage: '15,000 km',
            fuelType: 'Xăng',
            status: 'Hoạt động',
            lastService: '01/12/2024',
            nextService: '01/03/2025',
        }
    ];

    // Lấy danh sách xe
    static getVehicles() {
        return this.VEHICLES;
    }

    // Thêm xe mới
    static addVehicle(vehicle) {
        const newVehicle = {
            id: Date.now(),
            ...vehicle,
            mileage: '0 km',
            fuelType: 'Xăng',
            status: 'Hoạt động',
            lastService: new Date().toLocaleDateString('vi-VN'),
            nextService: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'), // 90 ngày sau
        };
        this.VEHICLES.push(newVehicle);
        return newVehicle;
    }

    // Xóa xe
    static removeVehicle(vehicleId) {
        this.VEHICLES = this.VEHICLES.filter(vehicle => vehicle.id !== vehicleId);
    }

    // Cập nhật xe
    static updateVehicle(vehicleId, updatedData) {
        const index = this.VEHICLES.findIndex(vehicle => vehicle.id === vehicleId);
        if (index !== -1) {
            this.VEHICLES[index] = { ...this.VEHICLES[index], ...updatedData };
        }
    }

    // Quản lý xe đã được đặt lịch
    static SCHEDULED_VEHICLES = new Set();

    // Đánh dấu xe đã được đặt lịch
    static markVehicleAsScheduled(vehicleId) {
        this.SCHEDULED_VEHICLES.add(vehicleId);
    }

    // Bỏ đánh dấu xe đã được đặt lịch (khi hủy lịch)
    static unmarkVehicleAsScheduled(vehicleId) {
        this.SCHEDULED_VEHICLES.delete(vehicleId);
    }

    // Kiểm tra xe đã được đặt lịch chưa
    static isVehicleScheduled(vehicleId) {
        return this.SCHEDULED_VEHICLES.has(vehicleId);
    }

    // Lấy danh sách xe có thể đặt lịch (chưa được đặt)
    static getAvailableVehicles(vehicleList = []) {
        return vehicleList.filter(vehicle => !this.SCHEDULED_VEHICLES.has(vehicle.vehicleId));
    }

    // Lấy danh sách xe đã được đặt lịch
    static getScheduledVehicles() {
        return this.VEHICLES.filter(vehicle => this.SCHEDULED_VEHICLES.has(vehicle.id));
    }

    // Test function - đánh dấu một số xe đã được đặt lịch để test
    static testMarkScheduledVehicles() {
        // Đánh dấu xe đầu tiên đã được đặt lịch
        this.markVehicleAsScheduled(1);
        console.log('Đã đánh dấu xe ID 1 (Mitsubishi Xpander) đã được đặt lịch');
    }

    // Reset tất cả xe về trạng thái chưa đặt lịch
    static resetAllVehicles() {
        this.SCHEDULED_VEHICLES.clear();
        console.log('Đã reset tất cả xe về trạng thái chưa đặt lịch');
    }
}