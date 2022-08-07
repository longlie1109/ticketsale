import React, { useEffect, useState } from "react";
import { Area, Pie } from '@ant-design/plots';
import { } from "@ant-design/charts";
import { DatePicker, DatePickerProps, Layout, Space } from "antd";
import '../styles/header.css'
import { collection, DocumentData, getDocs, QueryDocumentSnapshot, orderBy, query,where } from "firebase/firestore";
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
interface PieTest {
  Type: string,
  Value: number,
  Time: string,
}




 



const InnerIndex = () => {

  

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

  //donnut chart
  const [pieData, setPieData] = useState<PieTest[]>([]);
    const pieRef = collection(db, "test2");
  
    const getChart1 = async () => {
      const data = await getDocs(pieRef);
      const chartResult: PieTest[] = [];
      const result: QueryDocumentSnapshot<DocumentData>[] = [];
      data.docs.map((doc) => {
        result.push(doc);
        //console.log(doc)
        chartResult.push({ Type: doc.get('Type'), Value: parseInt(doc.get('Value')),Time:doc.get('TimePeriod') });
      });
      setPieData(chartResult);
      setData1(chartResult);
      console.log("chart result",chartResult)
    };
    useEffect(() => {
      getChart1();
    }, []);
    const onChange2: DatePickerProps['onChange'] = (date, dateString) => {

      const filteredData = dataSource1.filter(entry => { return (entry.Time.includes(dateString)) })
      setData1(filteredData);
      //console.log("filterdata", filteredData);
    };
    const dataSource1: PieTest[] = pieData;
    const [PiedataSources, setPieDataSources] = useState(dataSource1);
    const [data1, setData1] = useState(PiedataSources);
    //console.log("chart data", data)
  const DemoPie = () => {
   
    const config = {
  
      appendPadding: 10,
      data: data1,
      angleField: 'Value',
      colorField: 'Type',
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
  
  //Export
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
          <DatePicker onChange={onChange2} picker="quarter" />

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