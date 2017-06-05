import React from 'react';
import Sticky from 'react-stickynode';
import { List, Checkbox, Button, Toast } from 'antd-mobile';
import ajax from '../../services/ajax';
import Escape from '../../../base/util';
import './init.less';

const CheckboxItem = Checkbox.CheckboxItem;
let billBizNo = [];
const data = [];
const transNos = [];
let uuid = 1;

// 提交的toast
function submitToast() {
  Toast.offline('提交失败', 2);
}
// 断网的toast
function queryToast() {
  Toast.offline('网络连接失败', 2);
}
// 滚动 改变样式
function changeStyle() {
  window.onscroll = () => {
    const stickys = document.querySelectorAll('.stickys');
    const inner = document.querySelectorAll('.stickys>div');
    const months = document.querySelectorAll('.month');
    const top = document.documentElement.scrollTop || document.body.scrollTop;
    inner[0].style.zIndex = '2';
    if (stickys.length !== 1) {
      for (let i = 1; i < months.length; i += 1) {
        if (top >= stickys[i].parentNode.offsetTop) {
          months[0].innerHTML = months[i].innerHTML;
        } else if ((top <= stickys[1].parentNode.offsetTop) && (top >= stickys[0].parentNode.offsetTop)) {
          months[0].innerHTML = '本月';
        }
      }
    }
  };
}
// 计算总金额
function calculateMoney() {
  const checkArr = document.querySelectorAll('.checkboxs div label span input');
  const vals = document.querySelectorAll('.deal-money');
  // 获取每一条记录中的金额
  const reg = /-\d{1,}\.\d{2}/;
  // 初始化
  let sumNum = 0;
  const sum = [];
  billBizNo = [];
  for (let i = 0; i < checkArr.length; i += 1) {
    // 获取选中记录的金额
    if (checkArr[i].checked) {
      sum.push(vals[i].innerHTML.match(reg)[0].substr(1, 100));
      // 获取 transNo
      billBizNo.push(transNos[i].transNo);
    }
  }
  // 计算总金额
  sum.forEach((item) => {
    sumNum += Number(item) * 100;
    document.querySelector('.sum').innerHTML = (sumNum / 100).toFixed(2);
  });
  // 一个都没选择 总金额为0
  if (sum.length === 0) {
    document.querySelector('.sum').innerHTML = 0;
  }
}
class Init extends React.Component {
  // 初始化
  constructor(props) {
    super(props);
    this.state = {
      hasMore: '',
      status: 'true',
      notFoundUrl: '',
      url: '',
    };
  }
  // 获取数据
  componentDidMount() {
    this.queryData();
    changeStyle();
  }
  // 加载更多
  getMore() {
    uuid += 1;
    this.queryData();
  }
  // 提交
  submitMoney() {
    ajax({
      url: '/guide/submitBillsMoney.json',
      data: {
        billBizNo: billBizNo.join('_'),
      },
      ok: (res) => {
        if (res && res.url) {
          this.setState({
            url: res.url || '',
          });
          const { url } = this.state;
          location.href = Escape.unEscapeHtml(url);
        } else {
          submitToast();
        }
      },
      fail: () => {
        submitToast();
      },
    });
  }
  // 获取数据
  queryData() {
    ajax({
      url: '/guide/queryBills.json',
      data: {
        pageNo: uuid,
      },
      ok: (res) => {
        // 将数据放到data中
        if (res && res.data) {
          res.data.forEach((element) => {
            // 刚开始只有一页的数据
            if (uuid === 1) {
              data.push(element);
            }
            // 拿到每一条具体的数据
            element.trans.forEach((elem) => {
              transNos.push(elem);
            });
          });
          // 多页的数据
          if (uuid >= 2) {
            // 加载更多获取数据为一个月的情况
            if (res.data.length === 1) {
              // 判断刚获取的数据月份是否与现在的相同
              if (res.data[0].month === data[data.length - 1].month) {
                res.data[0].trans.forEach((el) => {
                  data[data.length - 1].trans.push(el);
                });
              } else {
                data.push(res.data[0]);
              }
            }
            // 加载更多获取数据为多个月的情况
            if (res.data.length > 1) {
              // 判断刚获取的数据的第一个月份是否与现在的最后一个月份相同
              if (data[data.length - 1].month === res.data[0].month) {
                res.data[0].trans.forEach((el) => {
                  data[data.length - 1].trans.push(el);
                });
                for (let i = 1; i < res.data.length; i += 1) {
                  data.push(res.data[i]);
                }
              } else {
                for (let i = 0; i < res.data.length; i += 1) {
                  data.push(res.data[i]);
                }
              }
            }
          }
          this.setState({
            hasMore: res.hasMore || '',
            notFoundUrl: res.notFoundUrl || '',
          });
        } else {
          this.setState({
            status: 'false',
          });
        }
      },
      fail: () => {
        queryToast();
      },
    });
  }

  // 没找到对应账单跳转
  goNoBill() {
    const { notFoundUrl } = this.state;
    if (notFoundUrl && navigator.onLine) {
      location.href = Escape.unEscapeHtml(notFoundUrl);
    } else if (navigator.onLine === false) {
      queryToast();
    }
  }
  // 渲染
  render() {
    const { hasMore, status } = this.state;
    const heig = document.documentElement.clientHeight;
    return (<div className="deal-container">
      {
        status === 'false' ?
          <div className="nonNamber" style={{ height: heig }}>
            <div className="conter" >
              <img src="https://zos.alipayobjects.com/rmsportal/GnkSaNhVMPryhdwqauZx.png" />
              <p>暂时没有交易记录</p>
            </div>
          </div> :
          <div>
            <div className="issue-bill">请选择遇到问题的账单</div>
            {data.map((item, i) => (
              <div key={i}>
                <Sticky className="stickys" enabled top={0} >
                  <span className="month">{`${item.month}` === new Date().toLocaleString().match(/(\/|-)\d{1,}/)[0].substr(1, 2) ? '本月' : `${item.month}月`}</span>{i === 0 ? <span className="no-bill" onClick={() => this.goNoBill()}>没找到对应账单</span> : ''}
                </Sticky>
                <div className="list">
                  <List>
                    {item.trans.map((val, j) => (
                      <CheckboxItem key={j} onClick={() => calculateMoney()} className="checkboxs">
                        <div className="content">
                          <span className="deal-name">{Escape.unEscapeHtml(Escape.unEscapeHtml(val.title))}</span><span className="deal-money">{val.amount}</span>
                        </div>
                        <div className="content">
                          <span className="deal-time">{val.time}</span><span className="deal-time">{val.stateDesc}</span>
                        </div>
                      </CheckboxItem>))}
                  </List>
                </div>
              </div>))}
            {hasMore === true ? <div className="more" onClick={() => this.getMore()}>加载更多</div> : <div className="more" />}
            <div className="btn-content">
              <div className="sums">总金额：<span className="sum">0</span></div>
              <Button className="btn" type="primary" onClick={() => this.submitMoney()}>提交交易</Button>
            </div>
          </div>
      }
    </div>);
  }
}
export default Init;

