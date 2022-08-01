import React, { useEffect, useState } from "react";
import { Area, Pie } from '@ant-design/plots';
import { } from "@ant-design/charts";
import { DatePicker, DatePickerProps, Layout, Space } from "antd";
import '../styles/header.css'
import { collection, DocumentData, getDocs, QueryDocumentSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase.config";
import { Typography } from 'antd';
import Item from "antd/lib/list/Item";
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
interface ChartTest {
  Id: string,
  TimePeriod: string,
  Value: number,
  Quarter: string,
}




// Donnut chart. for some god know reason this stupid chart dont accept array object from firebase. Will have to fix it later
const DemoPie = () => {
  const [pieData, setPieData] = useState<Pies[]>([]);
  const pieRef = collection(db, "piechart");

  const getChart = async () => {
    const data = await getDocs(pieRef);
    const chartResult: Pies[] = [];
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    data.docs.map((doc) => {
      result.push(doc);
      //console.log(doc)
      chartResult.push({ type: doc.get('Type'), value: parseInt(doc.get('Value')) });
    });
    setPieData(chartResult);
    setData(chartResult);
    // console.log("chart result",chartResult)
  };
  useEffect(() => {
    getChart();
  }, []);

  const dataSource: Pies[] = pieData;
  const [data, setData] = useState(dataSource);
  //console.log("chart data", data)

  const config = {

    appendPadding: 10,
    data: data,
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

  // Date picker:

  // Area Chart

  const [chartData, setChartData] = useState<ChartTest[]>([]);
  const chartRef = query(collection(db, "test"), orderBy("Month", "asc"));
  const [month, setMonth] = useState("");
  //lay data tu firebase
  const getChart = async () => {
    const data = await getDocs(chartRef);
    const chartResult: ChartTest[] = [];
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    data.docs.map((doc) => {
      result.push(doc);
      //console.log(doc)
      chartResult.push({ Id: doc.id, TimePeriod: doc.get('Month'), Value: parseInt(doc.get('Value')), Quarter: doc.get("timePeriod") });
    });
    setChartData(chartResult);
    setData(chartResult);
  };
  useEffect(() => {
    getChart();
  }, []);

  const dataSource: ChartTest[] = chartData;
  const [dataSources, setDataSources] = useState(dataSource);
  const [data, setData] = useState(dataSources);
  const onChange1: DatePickerProps['onChange'] = (date, dateString) => {

    const filteredData = dataSource.filter(entry => { return (entry.Quarter.includes(dateString)) })
    setData(filteredData);
    console.log("filterdata", filteredData);
  };


  const DemoArea = () => {
    const config = {
      data: data,
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
  const [total, setTotal] = useState<number>();
  useEffect(() => {
    let sum = 0;
    data.forEach(item => {
      sum += item.Value;
    })
    setTotal(sum);
  }, [data])



  return (<Content className="site-layout-background">


    <div className="trangchu">
      <Title>Thống kê</Title>
      <div className='doanhthu'>
        <Title level={3} style={{ display: 'inline', float: 'left', position: "absolute", top: '160px' }}>Doanh thu</Title>
        <Space direction="vertical" style={{ marginLeft: '82%' }}>

          <DatePicker onChange={onChange1} picker="quarter" style={{ display: 'inline', float: 'right' }} />
        </Space>
      </div>

      <div className='chartformonth'>
        <DemoArea />
      </div>

      <div style={{ textAlign: 'left', marginTop: '10px', marginLeft: '30px' }}>
        <div>Tổng doanh thu theo tuần</div>
        <div style={{ fontSize: '25px', fontWeight: '700' }}>
          {total} VND
        </div>
      </div>

      <div className='donutchart'>
        <Space direction="vertical" style={{ marginLeft: '82%' }}>
          <DatePicker onChange={() => onchange} picker="month" />

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