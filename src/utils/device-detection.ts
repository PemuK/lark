class DeviceDetection {
    private userAgent: string;
  
    constructor() {
      this.userAgent = navigator.userAgent.toLowerCase();
    }
  
    // 判断是否是移动设备
    public isMobile(): boolean {
      return /mobile|android|iphone|ipad|phone/.test(this.userAgent);
    }
  
    // 判断是否是平板设备
    public isTablet(): boolean {
      return /ipad|tablet/.test(this.userAgent) && !this.isMobile();
    }
  
    // 判断是否是桌面设备（非移动、非平板）
    public isDesktop(): boolean {
      return !this.isMobile() && !this.isTablet();
    }
  
    // 判断是否是 Android 设备
    public isAndroid(): boolean {
      return /android/.test(this.userAgent);
    }
  
    // 判断是否是 iOS 设备
    public isIOS(): boolean {
      return /iphone|ipad|ipod/.test(this.userAgent);
    }
  }
  
  export const deviceDetection = new DeviceDetection();
  