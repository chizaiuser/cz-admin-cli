/**
 * 基于1920宽度计算部分无法转为vw的数据的应有大小
 * @param size 传入的大小
 * @returns 返回计算后的结果
 */
export const computeSize = (size: number): number => {
    return document.body.clientWidth / 1920 * size
}
