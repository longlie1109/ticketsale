import React, { useEffect, useState } from "react";
import { Area, Pie } from '@ant-design/plots';
import { } from "@ant-design/charts";
import { DatePicker, Layout, Space } from "antd";
import '../styles/header.css'
import { collection, DocumentData, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase.config";
import { Typography } from 'antd';
const { Title } = Typography;
const { Footer, Sider, Content } = Layout;
interface Charts {
  Id: string,
  TimePeriod: string,
  Value: string,
}
interface Pies {
  type: string,
  value: number,
}
// Date picker:
function onMonth(date: any, dateString: any) {
  console.log(date, dateString);
}
// Area Chart
const DemoArea = () => {
  const [chartData, setChartData] = useState<Charts[]>([]);
  const chartRef = collection(db, "chart");
  //lay data tu firebase
  const getChart = async () => {
    const data = await getDocs(chartRef);
    const chartResult: Charts[] = [];
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    data.docs.map((doc) => {
      result.push(doc);
      //console.log(doc)
      chartResult.push({ Id: doc.id, TimePeriod: doc.get('timePeriod'), Value: doc.get('value') });
    });
    setChartData(chartResult);
    setData(chartResult);
  };
  useEffect(() => {
    getChart();
  }, []);

  const dataSource: Charts[] = chartData;
  const [data, setData] = useState(dataSource);

  const config = {
    data,
    xField: 'TimePeriod',
    yField: 'Value',
    xAxis: {
      range: [0, 1],
    },
    smooth: true,
    line: {
      color: '#ff6600',
      size: 4,
    },

    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#ffa200 1:#ffb431',
      };
    },
  };

  return <Area {...config} />;
};

// Donnut chart. for some god know reason this stupid chart dont accept array object from firebase. Will have to fix it later
const DemoPie = () => {
  const pieChartData: Pies[] = [
    {
      type: "new",
      value: 40
    },
    {
      type: "used",
      value: 25
    },
    {
      type: "expire",
      value: 22
    },
  ];


  const config = {
    appendPadding: 10,
    data: pieChartData,
    angleField: 'value',
    colorField: 'type',
    color: ['#4F75FF', '#FF8A48', '#FF85DE'],
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
    },
    height: 300
  };
  return <Pie {...config} />;
};



const InnerIndex = () => {



  return (<Content className="site-layout-background">
            
  
    <div className="trangchu">
      <Title>Thống kê</Title>
      <div className='doanhthu'>
      <Title level={3} style={{display:'inline',float:'left',position:"absolute",top:'160px'}}>Doanh thu</Title>
        <Space direction="vertical" style={{ marginLeft: '82%' }}>
          
          <DatePicker onChange={onMonth } picker="month" style={{display:'inline',float:'right'}} />
        </Space>
      </div>

      <div className='chartformonth'>
        <DemoArea />
      </div>

      <div style={{ textAlign: 'left', marginTop: '10px', marginLeft: '30px' }}>
        <div>Tổng doanh thu theo tuần</div>
        <div style={{ fontSize: '25px', fontWeight: '700' }}>
          512.000.000 Vnđ
        </div>
      </div>

      <div className='donutchart'>
        <Space direction="vertical" style={{ marginLeft: '82%' }}>
          <DatePicker onChange={onMonth} picker="month" />

        </Space>
        <div className='piechart'>
          <div><DemoPie /></div>
          <div><DemoPie /></div>
        </div>
      </div>

    </div>
    </Content>
  )


};
export default InnerIndex;