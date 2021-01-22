/**
 * 时间日期相关操作
 */

/**
 * 日期格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018-09-23
 * @param date 国际化日期格式
 */
export function formatDate(date) {
  return formatDateWithSeperator(date, "-", ":");
}

/**
 * 日期格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018-09-23
 * 可以指定日期分隔符
 * @param date 国际化日期格式
 */
export function formatDateWithSeperator(date, dateSeprator) {
  if (date != null) {
    const dateMat = new Date(date);
    const year = dateMat.getFullYear();
    let month = dateMat.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let day = dateMat.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    const dateFormat = year + dateSeprator + month + dateSeprator + day;
    return dateFormat;
  }
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018-09-23 11:54:16
 * @param datetime 国际化日期格式
 */
export function formatTime(datetime) {
  return formatTimeWithSeperator(datetime, "-", ":");
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018-09-23 11:54:16
 * 可以指定日期和时间分隔符
 * @param datetime 国际化日期格式
 */
export function formatTimeWithSeperator(datetime, dateSeprator, timeSeprator) {
  if (datetime != null) {
    const dateMat = new Date(datetime);
    const year = dateMat.getFullYear();
    let month = dateMat.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let day = dateMat.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    let hh = dateMat.getHours();
    if (hh < 10) {
      hh = "0" + hh;
    }
    let mm = dateMat.getMinutes();
    if (mm < 10) {
      mm = "0" + mm;
    }
    let ss = dateMat.getSeconds();
    if (ss < 10) {
      ss = "0" + ss;
    }
    const timeFormat =
      year +
      dateSeprator +
      month +
      dateSeprator +
      day +
      " " +
      hh +
      timeSeprator +
      mm +
      timeSeprator +
      ss;
    return timeFormat;
  }
}
