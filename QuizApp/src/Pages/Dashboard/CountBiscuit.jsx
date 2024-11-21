import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import PeiChartComponent from "./PieChart";


const CountBiscuit = ({data=[]}) => {
    
    return(
        <div className="row mb-4">
            {data.map((item, i)=>{
                return(
                    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xxl-3 mb-4" key={`countBiscuit_${i}`}>
                        <div className="card bg-body-secondary border-transparent">
                            <div className="card-body">
                                <h2 className="mb-3">{item.count}</h2>
                                <h3 className="text-body-secondary fs-4">{item.name}</h3>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CountBiscuit;