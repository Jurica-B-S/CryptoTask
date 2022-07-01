import React, {useEffect, useState} from 'react';
import { useTheme } from '@mui/material/styles';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line, Legend } from 'recharts';



export default function Chart(props:any) {
    const [chart_data, setChartData] = useState<any | null>(null);
    const theme = useTheme();
    useEffect(() => {
       if(props.data!==null){
        setChartData(props.data)
       }
      },[props.data]);
  return (
   
    <React.Fragment>
      <ResponsiveContainer>
        {/* Chart */}
        <AreaChart
            width={500}
            height={400}
            data={chart_data}
            margin={{
                top: 10,
                right: 10,
                left: 20,
                bottom: 0,
            }}
            >
            
         
          <Line name="Asset TVL" type="monotone" dataKey="Asset TVL" stroke="#8884d8" />
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="date" tick={{fontSize: 10}}/>
          <YAxis tick={{fontSize: 10}}/>
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>

      </ResponsiveContainer>
    </React.Fragment>
  );
}