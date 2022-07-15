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
      CSS : 0,
      HTML : 0
   }
   componentWillMount = () => {
      this.getMLuser1();
      this.getAIuser2();
      this.getJSuser3();
      this.getCSSuser4();
      this.getHTMLuser5();
   }

   getMLuser1 = async() => {
      try {
         const res = await axios.get('/api/profile/getSkillDataofml');
         this.setState({ML:res.data[0].totalCount});
      } catch (err) {
         console.log(err);
      }
   };
   getAIuser2 = async() => {
      try {
         const res = await axios.get('/api/profile/getSkillDataofai');
         this.setState({AI:res.data[0].totalCount});
      } catch (err) {
         console.log(err);
      }
   };
   getJSuser3 = async() => {
      try {
         const res = await axios.get('/api/profile/getSkillDataofjs');
         this.setState({JS:res.data[0].totalCount});
      } catch (err) {
         console.log(err);
      }
   };
   getCSSuser4 = async() => {
      try {
         const res = await axios.get('/api/profile/getSkillDataofcss');
         this.setState({CSS:res.data[0].totalCount});
      } catch (err) {
         console.log(err);
      }
   };
   getHTMLuser5 = async() => {
      try {
         const res = await axios.get('/api/profile/getSkillDataofhtmpl');
         this.setState({HTML:res.data[0].totalCount});
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
   var res = this.state.ML + this.state.AI + this.state.JS + this.state.CSS + this.state.HTML;
   // var ml = ((this.state.ML/res)*100);
   // var ai = ((this.state.AI/res)*100);
   // var js = ((this.state.JS/res)*100);
   // var css = ((this.state.CSS/res)*100);
   // let ans =  100 - res;
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
         name: "JS",
         value: (this.state.JS/res)*100
      },
      {
         name: "CSS",
         value: (this.state.CSS/res)*100
      },
      {
         name: "HTML",
         value: (this.state.HTML/res)*100
      }
   ];
   return (
      <div className="container">
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
      </div>
      );
   }
}
export default connect(null,{getMLuser})(PieRechartComponent);


