/**
 * 指定福利
 * 请修改为期望对应福利的字符串：
 * 
 * 守望先锋无限畅玩版：'OW_CLIENTSE'
 * 守望先锋典藏版升级包：'OW_UPGRADE'
 * 炉石卡包：'HS_PACKET'
 */
const WELFARE = 'OW_CLIENTSE';

// POST请求URL
const URL = 'https://tv.blizzard.cn/action/activities/HDRewardReceive';
// 请求时间间隔
const INTERVAL = 100;
// 开始抢购时间
const START_TIME = {
  hour: 10,
  minute: 4,
  second: 58,
};
// 请求体类型
const CONTENT_TYPE = 'application/x-www-form-urlencoded';
// 请求体内容
const BODY = `itemCode=${WELFARE}`;
// 最大尝试次数
const MAX_COUNT = 200;

// 当日抢购时间的时间戳
const moment = new Date();
console.log('[BRF] 当前时间：', moment);
moment.setHours(START_TIME.hour);
moment.setMinutes(START_TIME.minute);
moment.setSeconds(START_TIME.second);
moment.setMilliseconds(0);
const momentTime = moment.getTime();
console.log('[BRF] 正在等待到指定时间：', START_TIME);

// 等待定时器
const waitTimer = setInterval(() => {
  // 检查时间是否达到
  const date = Date.now();
  const delta = new Date(momentTime - date).getTime();
  if (delta > 0) {
    return;
  }

  console.log('[BRF] 达到指定时间，开始尝试请求');

  let cnt = 0;
  // 抢购定时器
  const fetchTimer = setInterval(() => {
    // 创建 POST 请求
    const request = new XMLHttpRequest();
    request.open('POST', URL);
    request.setRequestHeader('Content-Type', CONTENT_TYPE);
    request.onreadystatechange = () => {
      if (request.readyState == 4 && request.status == 200) {
        const resText = request.responseText;
        const res = JSON.parse(resText);
        console.log(`第${++cnt}次尝试结果：${res.status}，返回信息：${res.msg}`);
        // 结束抢购条件
        if (res.status !== 'fail' || cnt >= MAX_COUNT) {
          console.log(`总共${cnt}次尝试，最后结果：${res.status}，返回信息：${res.msg}`);
          clearInterval(fetchTimer);
        }
      }
    };
    request.send(BODY);
  }, INTERVAL);

  // 结束等待
  clearInterval(waitTimer);
}, 100);
