import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Profile from "../../reducers/profile";
import { getMLuser } from "../../actions/profile";
import {connect} from 'react-redux'
import axios from 'axios'
// import App from "../../App";


class PieRechartComponent extends React.Component {
  
   state = {
      ML : 0,
      AI : 0,
      JS : 0,
      CSS : 0
   }
   componentWillMount = () => {
      this.getMLuser1();
      this.getMLuser2();
      this.getMLuser3();
      this.getMLuser4();
   }

   getMLuser1 = async() => {
      try {
         const res = await axios.get('/api/profile/getSkillDataofml');
         this.setState({ML:res.data[0].totalCount});
      } catch (err) {
         console.log(err);
      }
   };
   getMLuser2 = async() => {
      try {
         const res = await axios.get('/api/profile/getSkillDataofai');
         this.setState({AI:res.data[0].totalCount});
      } catch (err) {
         console.log(err);
      }
   };
   getMLuser3 = async() => {
      try {
         const res = await axios.get('/api/profile/getSkillDataofjs');
         this.setState({JS:res.data[0].totalCount});
      } catch (err) {
         console.log(err);
      }
   };
   getMLuser4 = async() => {
      try {
         const res = await axios.get('/api/profile/getSkillDataofcss');
         this.setState({CSS:res.data[0].totalCount});
      } catch (err) {
         console.log(err);
      }
   };

   COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF"];

   CustomTooltip = ({ active, payload, label }) => {
      if (active) {
         return (
         <div
            className="custom-tooltip"
            style={{
               backgroundColor: "#ffff",
               padding: "5px",
               border: "1px solid #cccc"
            }}
         >
            <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
         </div>
      );
   }
   return null;
};
render() {
   var res = this.state.ML + this.state.AI + this.state.JS + this.state.CSS;
   var ml = ((this.state.ML/res)*100);
   var ai = ((this.state.AI/res)*100);
   var js = ((this.state.JS/res)*100);
   var css = ((this.state.CSS/res)*100);
   var pieData = [
      {
         name: "ML",
         value: (this.state.ML/res)*100
      },
      {
         name: "AI",
         value: (this.state.AI/res)*100
      },
      {
         name: "js",
         value: (this.state.JS/res)*100
      },
      {
         name: "css",
         value: (this.state.CSS/res)*100
      },
      {
         name: "Others",
         value: 150 - (ml+ai+js+css)
      }
   ];
   return (
      
      <PieChart width={730} height={300}>
      <Pie
         data={pieData}
         color="#000000"
         dataKey="value"
         nameKey="name"
         cx="50%"
         cy="50%"
         outerRadius={120}
         fill="#8884d8"
      >
         {pieData.map((entry, index) => (
            <Cell
               key={`cell-${index}`}
               fill={this.COLORS[index % this.COLORS.length]}
            />
         ))}
      </Pie>
      <Tooltip content={<this.CustomTooltip />} />
      <Profile/>
      <Legend />
      </PieChart>
      );
   }
}
export default connect(null,{getMLuser})(PieRechartComponent);


