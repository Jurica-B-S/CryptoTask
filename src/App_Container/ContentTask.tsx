import {useState, useEffect, useRef} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Components/Chart';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent  } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {AssetData, DrawingData } from './helper_files/typescript_interfaces'; 
import { useTheme } from '@mui/material/styles';

const CONST_INITIAL_ASSET_IN_INPUT_SELECTION = "ETH_Aave__USDC";


 function transform_api_data_for_graph_drawing(api_get_results:Array<any>){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      try {
      const resulting_data_tvl = api_get_results.map(item=>{
        let x :AssetData = {
          asset_id: item.assetId,
          array: item.selected_farm[0].tvlStakedHistory
        };
        return x;
      });
      const resulting_data_apr = resulting_data_tvl.map((item)=>{
        let x :AssetData = {
          asset_id: item.asset_id,
          array: item.array.map((y, index)=>{
            let z :DrawingData = {
              date: y.date,
              value:1000*(1.05)**index
          };
          return z;}
          )
        };
        return x;
      });
    //{ 
      
      resolve({tvl:resulting_data_tvl, apr:resulting_data_apr});
  } catch (error) {
    reject( "Error in data transform");
  }},0)})}
       


function get_asset_ids(api_get_results:Array<any>){
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      try {
        const resulting_data = api_get_results.map(item=>item.assetId);

        //{
        resolve(resulting_data);
      } catch (error) {
        reject("Error in data transform")
      }
    },0  );
})
}



export default function ContentTask(props:any) {
  const [asset_ids, setAllAssetIds] = useState<any | null>(null);
  const [user_chosen_assetId, setAssetId] = useState<any | null>(null);
  const [data_from_API, setDataFromAPI]= useState<any | null>(null);
  const [data_for_graph, setDataForGraph]= useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const theme = useTheme();
  

  async function initializeData(link:URL) {
    setLoading(true);
    try {
      
      const response = await fetch(link);
   
      const result = await response.json();
      

      const asset_ids = await get_asset_ids(result.data);
      setAllAssetIds(asset_ids);

      
      const data = await transform_api_data_for_graph_drawing(result.data);
      setDataFromAPI(data);


      setAssetId(CONST_INITIAL_ASSET_IN_INPUT_SELECTION);
    

    } catch (e) {
      setError(e);
    } finally {
      
      setLoading(false);
    }
  }


  useEffect(() => {
    initializeData(props.link);
  },[]);

  useEffect(() => {
    if(data_from_API!==null){
      getAssetDataForChartDrawing(user_chosen_assetId).then((data:any)=>{setDataForGraph(data)});
    }
  },[user_chosen_assetId]);




  function getAssetDataForChartDrawing(assetId:string){
    return new Promise((resolve,reject)=>{setTimeout(()=>{
      try {
        const apr:Array<AssetData> = data_from_API["apr"].filter((x:AssetData)=>{
          if(x.asset_id===assetId){
            return x;
          }
          else{
            return null;
          }
        });
        const tvl:Array<AssetData>= data_from_API["tvl"].filter((x:AssetData)=>{
          if(x.asset_id===assetId){
            return x;
          }
          else{
            return null;
          }
        });
        resolve({apr:apr[0].array, tvl:tvl[0].array});
      } catch (error) {
        reject(error);
      }
     
    },0);
      
      
    }) 
  }


  const handleSelectButton =  (event: SelectChangeEvent) => {
    const asset_id = event.target.value;
    setAssetId(asset_id);  
  };
   

  return(
      <Box sx={{ display: 'flex' }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={6} >
            
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 300,
                }}
              >
               <div style={{textAlign:"center"}}><p>Asset APR(y)</p></div>
                <Chart data = {data_for_graph!==null?data_for_graph.apr:null} />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={6} >
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 300,
                }}
              >
              <div style={{textAlign:"center"}}><p>Asset TVL</p></div>
              <Chart data = {data_for_graph!==null?data_for_graph.tvl:null}  />
              </Paper>
            </Grid>
            {/* Recent Orders */}
        
          </Grid>
          <Grid item xs={12} md={6} >
          <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 50,
                }}
              >
                
          <FormControl fullWidth>
          <InputLabel id="asset-selector-input">Asset selection</InputLabel>
            <Select
              labelId="asset-selector-label-id"
              id="asset-select-id"
              value={user_chosen_assetId!==null?user_chosen_assetId:"Loading"}
              label="asset_selection"
              onChange={handleSelectButton}
              >
                {asset_ids!==null?asset_ids.map((val:string)=><MenuItem value={val} key={uuidv4()}>{val}</MenuItem>):<MenuItem value=""></MenuItem>}
            </Select>
    
           </FormControl>
           </Paper>
            </Grid>
    
        </Container>
    
      </Box>
      
      )
}
   
      
  

  