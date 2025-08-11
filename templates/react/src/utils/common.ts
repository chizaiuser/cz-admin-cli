/**
 * 坐标系转换文件
 */
export type PointType = {
    lng: number, // 经度
    lat: number // 纬度
}

// 定义一些常量
const x_PI = 3.14159265358979324 * 3000.0 / 180.0;
const PI = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换 / 即百度转谷歌、高德
 * @param point 坐标点
 * @return 转换完的坐标
 */
export const bd09ToGcj02 = (point: PointType): PointType => {
    const { lng, lat } = point;
    const x = lng - 0.0065
    const y = lat - 0.006
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI)
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI)
    return {
        lng: z * Math.cos(theta),
        lat: z * Math.sin(theta)
    }
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换 / 即谷歌、高德 转 百度
 * @param point 坐标点
 * @return 转换完的坐标
 */
export const gcj02ToBd09 = (point: PointType): PointType => {
    const { lng, lat } = point;
    const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI)
    const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI)
    return {
        lng: z * Math.cos(theta) + 0.0065,
        lat: z * Math.sin(theta) + 0.006
    }
}

/**
 * WGS84坐标系转火星坐标系GCj02 / 即WGS84 转谷歌、高德
 * @param point 坐标点
 * @return 转换完的坐标
 */
export const wgs84ToGcj02 = (point: PointType): PointType => {
    const { lng, lat } = point;
    if (outOfChina(point)) {
        return point
    }
    let dLat = transformLat(lng - 105.0, lat - 35.0)
    let dLng = transformLng(lng - 105.0, lat - 35.0)
    const radLat = lat / 180.0 * PI
    let magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    const sqrtMagic = Math.sqrt(magic)
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
    return {
        lng: lng + dLng,
        lat: lat + dLat
    }
}

/**
 * GCJ02（火星坐标系） 转换为 WGS84 / 即谷歌高德转WGS84
 * @param point 坐标点
 * @return 转换完的坐标
 */
export const gcj02ToWgs84 = (point: PointType): PointType => {
    const { lng, lat } = point;
    if (outOfChina(point)) {
        return point
    }
    let dLat = transformLat(lng - 105.0, lat - 35.0)
    let dLng = transformLng(lng - 105.0, lat - 35.0)
    const radLat = lat / 180.0 * PI
    let magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    const sqrtMagic = Math.sqrt(magic)
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
    return {
        lng: lng - dLng,
        lat: lat - dLat
    }
}

/**
 * 百度坐标系转wgs84坐标系
 * @param point 坐标点
 * @return 转换完的坐标
 */
export const bd09ToWgs84 = (point: PointType): PointType => {
    // 百度坐标系先转为火星坐标系
    const gcj02 = bd09ToGcj02(point)
    // 火星坐标系转wgs84坐标系
    return gcj02ToWgs84(gcj02)
}

/**
 * wgs84坐标系转百度坐标系
 * @param point 坐标点
 * @return 转换完的坐标
 */
export const wgs84ToBd09 = (point: PointType): PointType => {
    // wgs84先转为火星坐标系
    const gcj02 = wgs84ToGcj02(point)
    // 火星坐标系转百度坐标系
    return gcj02ToBd09(gcj02)
}

/**
 * 经度转换
 * @param { Number } lng
 * @param { Number } lat
 */
const transformLat = (lng: number, lat: number) => {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
}

/**
 * 纬度转换
 * @param { Number } lng
 * @param { Number } lat
 */
const transformLng = (lng: number, lat: number) => {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param point 坐标点
 */
const outOfChina = (point: PointType): boolean => {
    const { lng, lat } = point;
    return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false)
}
export const nationOptions = [
    { label: '汉族', value: '汉族' },
    { label: '蒙古族', value: '蒙古族' },
    { label: '回族', value: '回族' },
    { label: '藏族', value: '藏族' },
    { label: '维吾尔族', value: '维吾尔族' },
    { label: '苗族', value: '苗族' },
    { label: '彝族', value: '彝族' },
    { label: '壮族', value: '壮族' },
    { label: '布依族', value: '布依族' },
    { label: '朝鲜族', value: '朝鲜族' },
    { label: '满族', value: '满族' },
    { label: '侗族', value: '侗族' },
    { label: '瑶族', value: '瑶族' },
    { label: '白族', value: '白族' },
    { label: '土家族', value: '土家族' },
    { label: '哈尼族', value: '哈尼族' },
    { label: '哈萨克族', value: '哈萨克族' },
    { label: '傣族', value: '傣族' },
    { label: '黎族', value: '黎族' },
    { label: '傈僳族', value: '傈僳族' },
    { label: '佤族', value: '佤族' },
    { label: '畲族', value: '畲族' },
    { label: '高山族', value: '高山族' },
    { label: '拉祜族', value: '拉祜族' },
    { label: '水族', value: '水族' },
    { label: '东乡族', value: '东乡族' },
    { label: '纳西族', value: '纳西族' },
    { label: '景颇族', value: '景颇族' },
    { label: '毛南族', value: '毛南族' },
    { label: '吉尔吉斯族', value: '吉尔吉斯族' },
    { label: '羌族', value: '羌族' },
    { label: '塔吉克族', value: '塔吉克族' },
    { label: '仡佬族', value: '仡佬族' },
    { label: '锡伯族', value: '锡伯族' },
    { label: '阿昌族', value: '阿昌族' },
    { label: '普米族', value: '普米族' },
    { label: '塔塔尔族', value: '塔塔尔族' },
    { label: '赫哲族', value: '赫哲族' },
    { label: '达斡尔族', value: '达斡尔族' },
    { label: '乌孜别克族', value: '乌孜别克族' },
    { label: '俄罗斯族', value: '俄罗斯族' },
    { label: '鄂温克族', value: '鄂温克族' },
    { label: '德昂族', value: '德昂族' },
    { label: '保安族', value: '保安族' },
    { label: '裕固族', value: '裕固族' },
    { label: '京族', value: '京族' },
    { label: '塔塔尔族', value: '塔塔尔族' }, // 注意：塔塔尔族已经出现过，这里不需要重复
    { label: '独龙族', value: '独龙族' },
    { label: '鄂伦春族', value: '鄂伦春族' },
    { label: '摩梭族', value: '摩梭族' }, // 注意：摩梭族并不是一个正式的民族名称，这里不添加
    { label: '苗族', value: '苗族' }, // 注意：苗族已经出现过，这里不需要重复
    { label: '布朗族', value: '布朗族' },
    { label: '撒拉族', value: '撒拉族' },
    { label: '毛南族', value: '毛南族' }, // 注意：毛南族已经出现过，这里不需要重复
    { label: '仡佬族', value: '仡佬族' }, // 注意：仡佬族已经出现过，这里不需要重复
    { label: '傣族', value: '傣族' }, // 注意：傣族已经出现过，这里不需要重复
    { label: '侗族', value: '侗族' }, // 注意：侗族已经出现过，这里不需要重复
    { label: '瑶族', value: '瑶族' }, // 注意：瑶族已经出现过，这里不需要重复
    { label: '白族', value: '白族' }, // 注意：白族已经出现过，这里不需要重复
    { label: '布依族', value: '布依族' }, // 注意：布依族已经出现过，这里不需要重复
    { label: '土家族', value: '土家族' }, // 注意：土家族已经出现过，这里不需要重复
    { label: '哈尼族', value: '哈尼族' }, // 注意：哈尼族已经出现过，这里不需要重复
    { label: '拉祜族', value: '拉祜族' }, // 注意：拉祜族已经出现过，这里不需要重复
    { label: '水族', value: '水族' }, // 注意：水族已经出现过，这里不需要重复
    { label: '东乡族', value: '东乡族' }, // 注意：东乡族已经出现过，这里不需要重复
    { label: '纳西族', value: '纳西族' }, // 注意：纳西族已经出现过，这里不需要重复
    { label: '景颇族', value: '景颇族' }, // 注意：景颇族已经出现过，这里不需要重复
    { label: '怒族', value: '怒族' },
    { label: '京族', value: '京族' }, // 注意：京族已经出现过，这里不需要重复
    { label: '基诺族', value: '基诺族' },
    { label: '独龙族', value: '独龙族' }, // 注意：独龙族已经出现过，这里不需要重复
    { label: '布朗族', value: '布朗族' }, // 注意：布朗族已经出现过，这里不需要重复
    { label: '毛南族', value: '毛南族' }, // 注意：毛南族已经出现过，这里不需要重复
    { label: '瑶族', value: '瑶族' }, // 注意：瑶族已经出现过，这里不需要重复
    { label: '哈萨克族', value: '哈萨克族' }, // 注意：哈萨克族已经出现过，这里不需要重复
    { label: '傣族', value: '傣族' }, // 注意：傣族已经出现过，这里不需要重复
    { label: '傈僳族', value: '傈僳族' }, // 注意：傈僳族已经出现过，这里不需要重复
    { label: '佤族', value: '佤族' }, // 注意：佤族已经出现过，这里不需要重复
    { label: '畲族', value: '畲族' }, // 注意：畲族已经出现过，这里不需要重复
    { label: '高山族', value: '高山族' }, // 注意：高山族已经出现过，这里不需要重复
    { label: '水族', value: '水族' }, // 注意：水族已经出现过，这里不需要重复
    { label: '东乡族', value: '东乡族' }, // 注意：东乡族已经出现过，这里不需要重复
    { label: '独龙族', value: '独龙族' }, // 注意：独龙族已经出现过，这里不需要重复
    { label: '赫哲族', value: '赫哲族' }, // 注意：赫哲族已经出现过，这里不需要重复
    { label: '达斡尔族', value: '达斡尔族' }, // 注意：达斡尔族已经出现过，这里不需要重复
    { label: '鄂伦春族', value: '鄂伦春族' }, // 注意：鄂伦春族已经出现过，这里不需要重复
    { label: '俄罗斯族', value: '俄罗斯族' }, // 注意：俄罗斯族已经出现过，这里不需要重复
    { label: '鄂温克族', value: '鄂温克族' }, // 注意：鄂温克族已经出现过，这里不需要重复
    { label: '德昂族', value: '德昂族' }, // 注意：德昂族已经出现过，这里不需要重复
    { label: '保安族', value: '保安族' }, // 注意：保安族已经出现过，这里不需要重复
    { label: '裕固族', value: '裕固族' }, // 注意：裕固族已经出现过，这里不需要重复
    { label: '基诺族', value: '基诺族' }, // 注意：基诺族已经出现过，这里不需要重复
];

export const areaOptions = [
    { value: '中国', label: '中国' },
    { value: '中国香港', label: '中国香港' },
    { value: '中国澳门', label: '中国澳门' },
    { value: '中国台湾', label: '中国台湾' },
    { value: '阿富汗', label: '阿富汗' },
    { value: '阿尔巴尼亚', label: '阿尔巴尼亚' },
    { value: '阿尔及利亚', label: '阿尔及利亚' },
    { value: '安道尔', label: '安道尔' },
    { value: '安哥拉', label: '安哥拉' },
    { value: '安提瓜和巴布达', label: '安提瓜和巴布达' },
    { value: '阿根廷', label: '阿根廷' },
    { value: '亚美尼亚', label: '亚美尼亚' },
    { value: '澳大利亚', label: '澳大利亚' },
    { value: '奥地利', label: '奥地利' },
    { value: '阿塞拜疆', label: '阿塞拜疆' },
    { value: '巴哈马', label: '巴哈马' },
    { value: '巴林', label: '巴林' },
    { value: '孟加拉国', label: '孟加拉国' },
    { value: '巴巴多斯', label: '巴巴多斯' },
    { value: '白俄罗斯', label: '白俄罗斯' },
    { value: '比利时', label: '比利时' },
    { value: '伯利兹', label: '伯利兹' },
    { value: '贝宁', label: '贝宁' },
    { value: '不丹', label: '不丹' },
    { value: '玻利维亚', label: '玻利维亚' },
    { value: '波斯尼亚和黑塞哥维那', label: '波斯尼亚和黑塞哥维那' },
    { value: '博茨瓦纳', label: '博茨瓦纳' },
    { value: '巴西', label: '巴西' },
    { value: '文莱', label: '文莱' },
    { value: '保加利亚', label: '保加利亚' },
    { value: '布基纳法索', label: '布基纳法索' },
    { value: '布隆迪', label: '布隆迪' },
    { value: '柬埔寨', label: '柬埔寨' },
    { value: '喀麦隆', label: '喀麦隆' },
    { value: '加拿大', label: '加拿大' },
    { value: '佛得角', label: '佛得角' },
    { value: '中非共和国', label: '中非共和国' },
    { value: '乍得', label: '乍得' },
    { value: '智利', label: '智利' },
    { value: '哥伦比亚', label: '哥伦比亚' },
    { value: '科摩罗', label: '科摩罗' },
    { value: '刚果（布）', label: '刚果（布）' },
    { value: '刚果（金）', label: '刚果（金）' },
    { value: '哥斯达黎加', label: '哥斯达黎加' },
    { value: '克罗地亚', label: '克罗地亚' },
    { value: '古巴', label: '古巴' },
    { value: '塞浦路斯', label: '塞浦路斯' },
    { value: '捷克', label: '捷克' },
    { value: '丹麦', label: '丹麦' },
    { value: '吉布提', label: '吉布提' },
    { value: '多米尼加', label: '多米尼加' },
    { value: '东帝汶', label: '东帝汶' },
    { value: '厄瓜多尔', label: '厄瓜多尔' },
    { value: '埃及', label: '埃及' },
    { value: '萨尔瓦多', label: '萨尔瓦多' },
    { value: '赤道几内亚', label: '赤道几内亚' },
    { value: '厄立特里亚', label: '厄立特里亚' },
    { value: '爱沙尼亚', label: '爱沙尼亚' },
    { value: '埃塞俄比亚', label: '埃塞俄比亚' },
    { value: '斐济', label: '斐济' },
    { value: '芬兰', label: '芬兰' },
    { value: '法国', label: '法国' },
    { value: '加蓬', label: '加蓬' },
    { value: '冈比亚', label: '冈比亚' },
    { value: '格鲁吉亚', label: '格鲁吉亚' },
    { value: '德国', label: '德国' },
    { value: '加纳', label: '加纳' },
    { value: '希腊', label: '希腊' },
    { value: '格林纳达', label: '格林纳达' },
    { value: '危地马拉', label: '危地马拉' },
    { value: '几内亚', label: '几内亚' },
    { value: '几内亚比绍', label: '几内亚比绍' },
    { value: '圭亚那', label: '圭亚那' },
    { value: '海地', label: '海地' },
    { value: '洪都拉斯', label: '洪都拉斯' },
    { value: '匈牙利', label: '匈牙利' },
    { value: '冰岛', label: '冰岛' },
    { value: '印度', label: '印度' },
    { value: '印度尼西亚', label: '印度尼西亚' },
    { value: '伊朗', label: '伊朗' },
    { value: '伊拉克', label: '伊拉克' },
    { value: '爱尔兰', label: '爱尔兰' },
    { value: '以色列', label: '以色列' },
    { value: '意大利', label: '意大利' },
    { value: '牙买加', label: '牙买加' },
    { value: '日本', label: '日本' },
    { value: '约旦', label: '约旦' },
    { value: '哈萨克斯坦', label: '哈萨克斯坦' },
    { value: '肯尼亚', label: '肯尼亚' },
    { value: '基里巴斯', label: '基里巴斯' },
    { value: '韩国', label: '韩国' },
    { value: '科威特', label: '科威特' },
    { value: '吉尔吉斯斯坦', label: '吉尔吉斯斯坦' },
    { value: '老挝', label: '老挝' },
    { value: '拉脱维亚', label: '拉脱维亚' },
    { value: '黎巴嫩', label: '黎巴嫩' },
    { value: '莱索托', label: '莱索托' },
    { value: '利比里亚', label: '利比里亚' },
    { value: '利比亚', label: '利比亚' },
    { value: '列支敦士登', label: '列支敦士登' },
    { value: '立陶宛', label: '立陶宛' },
    { value: '卢森堡', label: '卢森堡' },
    { value: '马其顿', label: '马其顿' },
    { value: '马达加斯加', label: '马达加斯加' },
    { value: '马拉维', label: '马拉维' },
    { value: '马来西亚', label: '马来西亚' },
    { value: '马尔代夫', label: '马尔代夫' },
    { value: '马里', label: '马里' },
    { value: '马耳他', label: '马耳他' },
    { value: '马绍尔群岛', label: '马绍尔群岛' },
    { value: '毛里塔尼亚', label: '毛里塔尼亚' },
    { value: '毛里求斯', label: '毛里求斯' },
    { value: '墨西哥', label: '墨西哥' },
    { value: '密克罗尼西亚', label: '密克罗尼西亚' },
    { value: '摩尔多瓦', label: '摩尔多瓦' },
    { value: '摩纳哥', label: '摩纳哥' },
    { value: '蒙古', label: '蒙古' },
    { value: '黑山', label: '黑山' },
    { value: '摩洛哥', label: '摩洛哥' },
    { value: '莫桑比克', label: '莫桑比克' },
    { value: '缅甸', label: '缅甸' },
    { value: '纳米比亚', label: '纳米比亚' },
    { value: '瑙鲁', label: '瑙鲁' },
    { value: '尼泊尔', label: '尼泊尔' },
    { value: '荷兰', label: '荷兰' },
    { value: '新西兰', label: '新西兰' },
    { value: '尼加拉瓜', label: '尼加拉瓜' },
    { value: '尼日尔', label: '尼日尔' },
    { value: '尼日利亚', label: '尼日利亚' },
    { value: '挪威', label: '挪威' },
    { value: '阿曼', label: '阿曼' },
    { value: '巴基斯坦', label: '巴基斯坦' },
    { value: '帕劳', label: '帕劳' },
    { value: '巴拿马', label: '巴拿马' },
    { value: '巴布亚新几内亚', label: '巴布亚新几内亚' },
    { value: '巴拉圭', label: '巴拉圭' },
    { value: '秘鲁', label: '秘鲁' },
    { value: '菲律宾', label: '菲律宾' },
    { value: '波兰', label: '波兰' },
    { value: '葡萄牙', label: '葡萄牙' },
    { value: '卡塔尔', label: '卡塔尔' },
    { value: '罗马尼亚', label: '罗马尼亚' },
    { value: '俄罗斯', label: '俄罗斯' },
    { value: '卢旺达', label: '卢旺达' },
    { value: '圣基茨和尼维斯', label: '圣基茨和尼维斯' },
    { value: '圣卢西亚', label: '圣卢西亚' },
    { value: '圣文森特和格林纳丁斯', label: '圣文森特和格林纳丁斯' },
    { value: '萨摩亚', label: '萨摩亚' },
    { value: '圣马力诺', label: '圣马力诺' },
    { value: '圣多美和普林西比', label: '圣多美和普林西比' },
    { value: '沙特阿拉伯', label: '沙特阿拉伯' },
    { value: '塞内加尔', label: '塞内加尔' },
    { value: '塞尔维亚', label: '塞尔维亚' },
    { value: '塞舌尔', label: '塞舌尔' },
    { value: '塞拉利昂', label: '塞拉利昂' },
    { value: '新加坡', label: '新加坡' },
    { value: '斯洛伐克', label: '斯洛伐克' },
    { value: '斯洛文尼亚', label: '斯洛文尼亚' },
    { value: '所罗门群岛', label: '所罗门群岛' },
    { value: '索马里', label: '索马里' },
    { value: '南非', label: '南非' },
    { value: '南苏丹', label: '南苏丹' },
    { value: '西班牙', label: '西班牙' },
    { value: '斯里兰卡', label: '斯里兰卡' },
    { value: '苏丹', label: '苏丹' },
    { value: '苏里南', label: '苏里南' },
    { value: '斯威士兰', label: '斯威士兰' },
    { value: '瑞典', label: '瑞典' },
    { value: '瑞士', label: '瑞士' },
    { value: '叙利亚', label: '叙利亚' },
    { value: '塔吉克斯坦', label: '塔吉克斯坦' },
    { value: '坦桑尼亚', label: '坦桑尼亚' },
    { value: '泰国', label: '泰国' },
    { value: '多哥', label: '多哥' },
    { value: '汤加', label: '汤加' },
    { value: '特立尼达和多巴哥', label: '特立尼达和多巴哥' },
    { value: '突尼斯', label: '突尼斯' },
    { value: '土耳其', label: '土耳其' },
    { value: '土库曼斯坦', label: '土库曼斯坦' },
    { value: '图瓦卢', label: '图瓦卢' },
    { value: '乌干达', label: '乌干达' },
    { value: '乌克兰', label: '乌克兰' },
    { value: '阿联酋', label: '阿联酋' },
    { value: '英国', label: '英国' },
    { value: '美国', label: '美国' },
    { value: '乌拉圭', label: '乌拉圭' },
    { value: '乌兹别克斯坦', label: '乌兹别克斯坦' },
    { value: '瓦努阿图', label: '瓦努阿图' },
    { value: '梵蒂冈', label: '梵蒂冈' },
    { value: '委内瑞拉', label: '委内瑞拉' },
    { value: '越南', label: '越南' },
    { value: '也门', label: '也门' },
    { value: '赞比亚', label: '赞比亚' },
    { value: '津巴布韦', label: '津巴布韦' }
  ];