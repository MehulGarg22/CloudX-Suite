import React, { useState, useEffect } from "react"
import axios from 'axios';
import { Table } from 'antd';

export default function PlatformRewards(){
    
    const [data, setData]= useState()
    const [loading, setLoading]= useState(false)

    useEffect(()=>{
        setLoading(true)
        axios.get("https://4xhs80hti5.execute-api.us-east-1.amazonaws.com/credit-card-details/get").then((resp)=>{
            console.log("resp", resp.data)
            setData(resp.data.items)
            setLoading(false)
        }).catch((err)=>{
            console.log("Table error in GET call is: ", err)
            setLoading(false)
        })
    },[])


    const columns = [
        {
          title: 'Card Name',
          dataIndex: 'name',
          align: 'center',
          key: 'name',
        },
        {
          title: 'Card Issuer Bank',
          dataIndex: 'cardIssuer',
          align: 'center',
          key: 'cardIssuer',
        },
        {
            title: 'Fees',
            align: 'center',
            children:[

                {
                    title: 'Joining Fee',
                    dataIndex: 'joiningfee',
                    align: 'center',
                    key: 'joiningfee',
                    sorter: (a, b) => Number(a.joiningfee) - Number(b.joiningfee),
                },
                {
                    title: 'Annual Fee',
                    dataIndex: 'annualfee',
                    align: 'center',
                    key: 'annualfee',
                    sorter: (a, b) => Number(a.annualfee) - Number(b.annualfee),
                },
            ]
        },
        {
            title: 'Platform Spends',
            align: 'center',
            children:[
                {
                    title: 'Amazon',
                    dataIndex: 'amazon',
                    align: 'center',
                    key: 'amazon',
                    sorter: (a, b) => {
                        const amazonA = a.amazon ? parseFloat(a.amazon.replace('%', '')) : 0;
                        const amazonB = b.amazon ? parseFloat(b.amazon.replace('%', '')) : 0;
                        return amazonA - amazonB;
                    },
                },

                {
                    title: 'Bigbasket',
                    dataIndex: 'bigbasket',
                    align: 'center',
                    key: 'bigbasket',
                    sorter: (a, b) => {
                        const bigbasketA = a.bigbasket ? parseFloat(a.bigbasket.replace('%', '')) : 0;
                        const bigbasketB = b.bigbasket ? parseFloat(b.bigbasket.replace('%', '')) : 0;
                        return bigbasketA - bigbasketB;
                    },
                },
                {
                    title: 'Flipkart',
                    align: 'center',
                    dataIndex: 'flipkart',
                    key: 'flipkart',
                    sorter: (a, b) => {
                        const flipkartA = a.flipkart ? parseFloat(a.flipkart.replace('%', '')) : 0;
                        const flipkartB = b.flipkart ? parseFloat(b.flipkart.replace('%', '')) : 0;
                        return flipkartA - flipkartB;
                    },
                },
                {
                    title: 'Myntra',
                    dataIndex: 'myntra',
                    align: 'center',
                    key: 'myntra',
                    sorter: (a, b) => {
                        const myntraA = a.myntra ? parseFloat(a.myntra.replace('%', '')) : 0;
                        const myntraB = b.myntra ? parseFloat(b.myntra.replace('%', '')) : 0;
                        return myntraA - myntraB;
                    },
                },
                {
                    title: 'Ola',
                    dataIndex: 'ola',
                    align: 'center',
                    key: 'ola',
                    sorter: (a, b) => {
                        const olaA = a.ola ? parseFloat(a.ola.replace('%', '')) : 0;
                        const olaB = b.ola ? parseFloat(b.ola.replace('%', '')) : 0;
                        return olaA - olaB;
                    },
                },
                {
                    title: 'Swiggy',
                    dataIndex: 'swiggy',
                    align: 'center',
                    key: 'swiggy',
                    sorter: (a, b) => {
                        const swiggyA = a.swiggy ? parseFloat(a.swiggy.replace('%', '')) : 0;
                        const swiggyB = b.swiggy ? parseFloat(b.swiggy.replace('%', '')) : 0;
                        return swiggyA - swiggyB;
                    },
                },
                {
                    title: 'Rapido',
                    dataIndex: 'rapido',
                    align: 'center',
                    key: 'rapido',
                    sorter: (a, b) => {
                        const rapidoA = a.rapido ? parseFloat(a.rapido.replace('%', '')) : 0;
                        const rapidoB = b.rapido ? parseFloat(b.rapido.replace('%', '')) : 0;
                        return rapidoA - rapidoB;
                    },
                },
                {
                    title: 'Uber',
                    dataIndex: 'uber',
                    align: 'center',
                    key: 'uber',
                    sorter: (a, b) => {
                        const uberA = a.uber ? parseFloat(a.uber.replace('%', '')) : 0;
                        const uberB = b.uber ? parseFloat(b.uber.replace('%', '')) : 0;
                        return uberA - uberB;
                    },
                },
                {
                    title: 'Zomato',
                    dataIndex: 'zomato',
                    align: 'center',
                    key: 'zomato',
                    sorter: (a, b) => {
                        const zomatoA = a.zomato ? parseFloat(a.zomato.replace('%', '')) : 0;
                        const zomatoB = b.zomato ? parseFloat(b.zomato.replace('%', '')) : 0;
                        return zomatoA - zomatoB;
                    },
                },
            ]
        },

        // {
        //   title: 'Rewards',
        //   key: 'features',
        //   align: 'center',
        //   render: (text, record) => (
        //     <div>            
        //         <Table
        //           columns={[
        //             { title: "Spend", dataIndex: 'featureName', key: 'featureName' },
        //             { title: "Spend Benefit", dataIndex: 'featureValue', key: 'featureValue' },
        //             { title: "Reward Capping", dataIndex: 'rewardCapping', key: 'rewardCapping' },
        //             { title: "Information", dataIndex: 'remarks', key: 'remarks' },
        //           ]}
        //           dataSource={record.list}
        //           pagination={false} // Disable pagination for nested table
        //           size="small"
        //           bordered
        //         />
        //     </div>
        //   ),
        // },
        {
            title: 'Additional Details',
            dataIndex: 'comments',
            key: 'comments',
            align: 'center',
            width:'10%',
        },
    ];


    return(
        <div style={{ overflowX: 'hidden', width: '100%', backgroundColor: '#EBE8DB', height: '90vh' }}>
            <Table
                dataSource={data}
                columns={columns}
                loading={loading}
                rowKey="id" // Add a unique key for each row
                className="data-table"
                style={{margin:'20px'}}
                bordered
                pagination={{ defaultPageSize: 15, showSizeChanger: true, pageSizeOptions: ['20', '25', '30', '50']}}
            />
        </div>
      );
}