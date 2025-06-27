import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Tooltip, Card, Form, Input, Space, ConfigProvider } from 'antd';
import './adminForm.css';
import { IoMdInformationCircleOutline } from "react-icons/io";
import axios from 'axios';
import Notification from '../../features/notification';
import { Skeleton } from 'antd';
import AdminNavbar from './adminNavbar';


export default function CreditCardReward() {
    const [initialValue, setInitialValue] = useState({ items: [{}] });
    const [cards, setCards] = useState([{}]); // Initialize as an empty array
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad]=useState(false)
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [description, setDescription] = useState("");
    const [form] = Form.useForm();


    const cardGetAPI = "https://4xhs80hti5.execute-api.us-east-1.amazonaws.com/credit-card-details/get";
    const cardPostAPI = "https://q08qqknh16.execute-api.us-east-1.amazonaws.com/credit-card-details/post";
    const cardDeleteAPI = "https://maqwhoyk0g.execute-api.us-east-1.amazonaws.com/credit-card-details/delete"


    const cardetailsFromDatabase=()=>{
        setInitialLoad(true)
        axios.get(cardGetAPI).then((resp) => {
            console.log("resp.data:", resp.data);
            const fetchedItems = resp.data.items || [];
            setCards(fetchedItems);
    
            console.log("cards:", fetchedItems); // Log fetchedItems instead of cards
            console.log("cards[0]?.cardIssuer:", fetchedItems[0]?.cardIssuer); // Log fetchedItems instead of cards
    
            if (fetchedItems.length > 0) {
                form.setFieldsValue({
                    items: fetchedItems.map(item => ({
                        id: item.id, 
                        cardIssuer: item.cardIssuer,
                        name: item.name,
                        annualfee: item.annualfee,
                        joiningfee: item.joiningfee,
                        annualFeeWaiver: item.annualFeeWaiver,
                        domesticLoungeAccess: item.domesticLoungeAccess,
                        internationalLoungeAccess: item.internationalLoungeAccess,
                        fuelDiscount: item.fuelDiscount,
                        flipkart: item.flipkart,
                        swiggy: item.swiggy,
                        zomato: item.zomato,
                        bigbasket: item.bigbasket,
                        amazon: item.amazon,
                        uber: item.uber,
                        ola: item.ola,
                        rapido: item.rapido,
                        myntra: item.myntra,
                        comments: item.comments,
                        list: item.list || []
                    }))
                });
                console.log("form.getFieldsValue():", form.getFieldsValue());
                setInitialLoad(false)
            }
        }).catch((err)=> console.log("Error is: ", err));
    }

    useEffect(() => {
        cardetailsFromDatabase()
    }, []);

    const deleteCard=(index)=>{
        console.log("inside delete function: ",index)
        axios.delete(cardDeleteAPI, {
            data:{
                id: index           // In this case, we're sending a DELETE request to cardDeleteAPI with a request body containing { id: index }. The request body is included in the data property of the configuration object, which is the second argument passed to axios.delete().
            }
        }).then((res)=>{
            console.log(res)
            cardetailsFromDatabase()
            setMessage('Success!');
            setDescription('The card detail successfully deleted');
            setType('success');
        }).catch((err)=>{
            console.log(err)
            setMessage('Oops! Something went wrong.');
            setDescription('We were unable to delete the card detail. Please try again later.');
            setType('error');
        })
    }

    const rewardFields = [
        { label: "Annual Fee Waiver", key: "annualFeeWaiver", placeholder: "Annual Fee Waiver" },
        { label: "Domestic Lounge", key: "domesticLoungeAccess", placeholder: "Domestic Lounge Access" },
        { label: "Internation Lounge", key: "internationalLoungeAccess", placeholder: "Internation Lounge Access" },
        { label: "Fuel Discount", key: "fuelDiscount", placeholder: "Fuel Discount" },
        { label: "Amazon", key: "amazon", placeholder: "Amazon Rewards" },
        { label: "Big Basket", key: "bigbasket", placeholder: "Bigbasket Rewards" },
        { label: "Flipkart", key: "flipkart", placeholder: "Flipkart Rewards" },
        { label: "Myntra", key: "myntra", placeholder: "Myntra Rewards" },
        { label: "Ola", key: "ola", placeholder: "Ola Rewards" },
        { label: "Rapido", key: "rapido", placeholder: "Rapido Rewards" },
        { label: "Swiggy", key: "swiggy", placeholder: "Swiggy Rewards" },
        { label: "Uber", key: "uber", placeholder: "Uber Rewards" },
        { label: "Zomato", key: "zomato", placeholder: "Zomato Rewards" },
    ];


    const handleSubmit = () => {
        setType('');
        console.log(form.getFieldsValue());
        setLoading(true);
        axios.post(cardPostAPI, form.getFieldsValue().items).then((res) => {
            console.log("card details post response", res);
            setLoading(false);
            cardetailsFromDatabase()
            setMessage('Success!');
            setDescription('The information you provided has been successfully saved.');
            setType('success');
        }).catch((err) => {
            cardetailsFromDatabase()
            console.log(err);
            setLoading(false);
            setMessage('Oops! Something went wrong.');
            setDescription('We were unable to save your changes. Please try again later.');
            setType('error');
        });
    };

    return (
        <div>
            <AdminNavbar />
            <div style={{ overflowX: 'hidden', width: '100%', backgroundColor: '#EBE8DB', height: '90vh' }}>
                {
                    initialLoad ? 
                        <div style={{margin:'50px'}}>
                            <Skeleton.Button active small/> 
                            <Skeleton active small /> 
                            <Skeleton.Button active small /> 
                            <Skeleton active small/> 
                            <Skeleton.Button active small/> 
                            <Skeleton active small /> 
                        </div>
                    :
                        <Form
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                            form={form}
                            name="dynamic_form_complex"
                            style={{ maxWidth: 1300, width: '100%', marginLeft: '40px', paddingRight: '50px', alignItems: 'center' }}
                            autoComplete="off"
                        >
                            <Notification type={type} message={message} description={description} />
                            <Form.List name="items">
                                {(fields, { add, remove }) => (
                                    <div>
                                        <div
                                        style={{
                                            display: 'flex',
                                            marginTop:'10px',
                                            flexWrap: 'wrap',
                                            columnGap: 16,
                                            rowGap: 16,
                                        }}
                                        >
                                            {fields.map((field, index) => (
                                                <Card
                                                    size="small"
                                                    title={`Credit Card ${field.name + 1}`}
                                                    key={field.key}
                                                    extra={
                                                        <CloseOutlined
                                                            onClick={() => {
                                                                remove(index)
                                                                deleteCard(cards[field?.key]?.id)
                                                                console.log("close: ",cards[field?.key])
                                                            }}
                                                        />
                                                    }
                                                    className="responsive-card"
                                                    style={{ marginTop: '10px' }}
                                                >
                                                    <Form.Item label="Card Issuer Bank" name={[field.name, 'cardIssuer']} initialValue={cards[index]?.cardIssuer}>
                                                        <div style={{ display: 'flex' }}>
                                                            <Input defaultValue={cards[index]?.cardIssuer} placeholder="Card Issuer Name" />
                                                            <Tooltip placement="top" title="Enter credit card issuing bank">
                                                                <span style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '20px' }}>
                                                                    <IoMdInformationCircleOutline />
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    </Form.Item>
                                                    <Form.Item label="Name" name={[field.name, 'name']} initialValue={cards[index]?.name}>
                                                        <div style={{ display: 'flex' }}>
                                                            <Input defaultValue={cards[index]?.name} placeholder="Credit Card Name" />
                                                            <Tooltip placement="top" title="Enter credit card name">
                                                                <span style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '20px' }}>
                                                                    <IoMdInformationCircleOutline />
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    </Form.Item>
                                                    <Form.Item label="Annual fee" name={[field.name, 'annualfee']} initialValue={cards[index]?.annualfee}>
                                                        <div style={{ display: 'flex' }}>
                                                            <Input defaultValue={cards[index]?.annualfee} placeholder="Annual Fee" />
                                                            <Tooltip placement="top" title="Enter Annual Fee in INR which is charged every year">
                                                                <span style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '20px' }}>
                                                                    <IoMdInformationCircleOutline />
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    </Form.Item>
                                                    <Form.Item label="Joining fee" name={[field.name, 'joiningfee']} initialValue={cards[index]?.joiningfee}>
                                                        <div style={{ display: 'flex' }}>
                                                            <Input defaultValue={cards[index]?.joiningfee} placeholder="Joining Fee" />
                                                            <Tooltip placement="top" title="Enter Joining Fee in INR which is charged at the time of joining the card">
                                                                <span style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '20px' }}>
                                                                    <IoMdInformationCircleOutline />
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    </Form.Item>

                                                    {rewardFields.map(({ label, key, placeholder }) => (
                                                    <Form.Item key={key} label={label} name={[field.name, key]} initialValue={cards[index]?.[key]}>
                                                        <div style={{ display: 'flex' }}>
                                                        <Input defaultValue={cards[index]?.[key]} placeholder={placeholder} />
                                                        <Tooltip placement="top" title={`Enter ${label} data`}>
                                                            <span style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '20px' }}>
                                                            <IoMdInformationCircleOutline />
                                                            </span>
                                                        </Tooltip>
                                                        </div>
                                                    </Form.Item>
                                                    ))}


                                                    <Form.Item label="Comment" name={[field.name, 'comments']} initialValue={cards[index]?.comments}>
                                                        <div style={{ display: 'flex' }}>
                                                            <Input defaultValue={cards[index]?.comments} placeholder="Additional information" />
                                                            <Tooltip placement="top" title="Enter Additional Information">
                                                                <span style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '20px' }}>
                                                                    <IoMdInformationCircleOutline />
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    </Form.Item>
                                                    <Form.Item label="Rewards">
                                                        <Form.List name={[field.name, 'list']}>
                                                        {(subFields, subOpt) => (
                                                            <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                                            {subFields.map((subField, subIndex) => (
                                                                <Space key={subField.key}>
                                                                <Form.Item noStyle name={[subField.name, 'featureName']}>
                                                                    <div style={{display:'flex'}}>
                                                                        <Input defaultValue={cards[index]?.list?.[subIndex]?.featureName} placeholder="Feature"/>
                                                                        <Tooltip placement="top" title="Enter feature name" >
                                                                        <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                                                                            <IoMdInformationCircleOutline/>
                                                                        </span>
                                                                        </Tooltip>
                                                                    </div>
                                                                </Form.Item>
                                                                <Form.Item noStyle name={[subField.name, 'featureValue']}>
                                                                    <div style={{display:'flex'}}>
                                                                        <Input defaultValue={cards[index]?.list?.[subIndex]?.featureValue} placeholder="Feature value"/>
                                                                        <Tooltip placement="top" title="Enter feature value" >
                                                                        <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                                                                            <IoMdInformationCircleOutline/>
                                                                        </span>
                                                                        </Tooltip>
                                                                    </div>
                                                                </Form.Item>
                                                                <Form.Item noStyle name={[subField.name, 'rewardCapping']}>
                                                                    <div style={{display:'flex'}}>
                                                                        <Input defaultValue={cards[index]?.list?.[subIndex]?.rewardCapping} placeholder="Reward Capping"/>
                                                                        <Tooltip placement="top" title="Enter Reward Capping" >
                                                                        <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                                                                            <IoMdInformationCircleOutline/>
                                                                        </span>
                                                                        </Tooltip>
                                                                    </div>
                                                                </Form.Item>
                                                                <Form.Item noStyle name={[subField.name, 'remarks']}>
                                                                    <div style={{display:'flex'}}>
                                                                        <Input defaultValue={cards[index]?.list?.[subIndex]?.remarks} placeholder="Additional comments"/>
                                                                        <Tooltip placement="top" title="Enter Additional Comments" >
                                                                        <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                                                                            <IoMdInformationCircleOutline/>
                                                                        </span>
                                                                        </Tooltip>
                                                                    </div>
                                                                </Form.Item>
                                                                <CloseOutlined
                                                                    onClick={() => {
                                                                    subOpt.remove(subField.name);
                                                                    }}
                                                                />
                                                                </Space>
                                                            ))}
                                                            <Button type="dashed" onClick={() => subOpt.add()} block>
                                                                + Add Sub Item
                                                            </Button>
                                                            </div>
                                                        )}
                                                        </Form.List>
                                                    </Form.Item>
                                                </Card>
                                            ))}
                                            
                                            
                                        </div>
                                        <br />
                                            <div style={{ display: 'flex' }}>
                                                <ConfigProvider theme={{ token: { colorPrimary: '#a51d4a', borderRadius: 6, colorBgContainer: 'white' } }}>
                                                    <Button type="dashed" onClick={() => add()} style={{ marginBottom: '10px', width: '20%' }} block>
                                                        + Add Item
                                                    </Button>
                                                    <Button onClick={handleSubmit} variant="filled" loading={loading} style={{ marginBottom: '10px', marginLeft: '10px', width: '20%' }}>
                                                        Submit
                                                    </Button>
                                                </ConfigProvider>
                                            </div>

                                    </div>
                                )}
                            </Form.List>
                        </Form>
                }
            </div>
        </div>

    );
}