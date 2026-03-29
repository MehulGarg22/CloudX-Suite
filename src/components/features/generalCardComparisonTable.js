import React, { useState, useEffect } from "react"
import axios from 'axios';
import { Table, Card, Typography, Space, Tag, Tooltip, Skeleton, Row, Col, Statistic, Badge, Avatar, Button } from 'antd';
import { CreditCardOutlined, BankOutlined, GiftOutlined, InfoCircleOutlined, TrophyOutlined, PercentageOutlined, DollarOutlined, StarOutlined, ThunderboltOutlined, RocketOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import './creditCardPlatformRewards.css';
import Footer from "../footer/footer";
import ModernSkeleton from "../ModernSkeleton";
import { getSession } from "../loginAuth/auth";

const { Title, Text } = Typography;

export default function GeneralCardComparisonTable() {

    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [expandedComments, setExpandedComments] = useState(new Set())

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const session = await getSession();
                const token = session.getIdToken().getJwtToken();
                const resp = await axios.get(
                    process.env.REACT_APP_BASE_URL + process.env.REACT_APP_CREDIT_CARD_DETAILS_GET,
                    { headers: { Authorization: token } }
                );
                console.log("resp", resp.data)
                setData(resp.data.items)
            } catch (err) {
                console.log("Table error in GET call is: ", err)
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, [])

    // Helper: safely parse reward value (handles both "1.5%" strings and 1.5 numbers)
    const parseRewardValue = (val) => {
        if (!val) return 0;
        if (typeof val === 'number') return val;
        return parseFloat(String(val).replace('%', '')) || 0;
    };

    const formatFee = (fee) => {
        if (!fee || fee === '0' || fee === 0) {
            return <Tag color="green" className="fee-tag">FREE</Tag>;
        }
        return <Tag color="orange" className="fee-tag">₹{fee}</Tag>;
    };

    const formatReward = (reward) => {
        if (!reward || reward === '0%' || reward === '0' || reward === 0) {
            return <Text type="secondary" className="no-reward">No Reward</Text>;
        }
        const value = parseRewardValue(reward);
        let color = 'default';
        if (value >= 5) color = 'success';
        else if (value >= 2) color = 'processing';
        else if (value >= 1) color = 'warning';

        return <Tag color={color} className="reward-tag">{reward}</Tag>;
    };

    const toggleCommentExpansion = (recordId) => {
        setExpandedComments(prev => {
            const newSet = new Set(prev)
            if (newSet.has(recordId)) {
                newSet.delete(recordId)
            } else {
                newSet.add(recordId)
            }
            return newSet
        })
    }
    // All columns code remains exactly the same
    const columns = [
        {
            title: (
                <Space>
                    <CreditCardOutlined />
                    <Text strong>Card Details</Text>
                </Space>
            ),
            children: [
                {
                    title: 'Card Name',
                    dataIndex: 'name',
                    key: 'name',
                    width: 200,
                    fixed: 'left',
                    render: (text) => (
                        <div className="card-name-cell">
                            <Text strong className="card-name">{text}</Text>
                        </div>
                    ),
                    sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
                },
                {
                    title: 'Issuer Bank',
                    dataIndex: 'cardIssuer',
                    key: 'cardIssuer',
                    fixed: 'left',
                    width: 150,
                    render: (text) => (
                        <div className="bank-cell">
                            <BankOutlined className="bank-icon" />
                            <Text className="bank-name">{text}</Text>
                        </div>
                    ),
                    sorter: (a, b) => (a.cardIssuer || '').localeCompare(b.cardIssuer || ''),
                },
            ]
        },
        {
            title: (
                <Space>
                    <GiftOutlined />
                    <Text strong>Fees Structure</Text>
                </Space>
            ),
            children: [
                {
                    title: 'Joining Fee',
                    dataIndex: 'joiningfee',
                    key: 'joiningfee',
                    width: 120,
                    render: formatFee,
                    sorter: (a, b) => Number(a.joiningfee) - Number(b.joiningfee),
                },
                {
                    title: 'Annual Fee',
                    dataIndex: 'annualfee',
                    key: 'annualfee',
                    width: 120,
                    render: formatFee,
                    sorter: (a, b) => Number(a.annualfee) - Number(b.annualfee),
                },
            ]
        },
        {
            title: (
                <Space>
                    <GiftOutlined />
                    <Text strong>Platform Rewards (%)</Text>
                </Space>
            ),
            children: [
                {
                    title: (
                        <Tooltip title="Amazon Shopping Rewards">
                            <div className="platform-header">
                                <span className="platform-icon amazon-icon">A</span>
                                <Text>Amazon</Text>
                            </div>
                        </Tooltip>
                    ),
                    dataIndex: 'amazon',
                    key: 'amazon',
                    width: 100,
                    render: formatReward,
                    sorter: (a, b) => parseRewardValue(a.amazon) - parseRewardValue(b.amazon),
                },
                {
                    title: (
                        <Tooltip title="BigBasket Grocery Rewards">
                            <div className="platform-header">
                                <span className="platform-icon bigbasket-icon">B</span>
                                <Text>BigBasket</Text>
                            </div>
                        </Tooltip>
                    ),
                    dataIndex: 'bigbasket',
                    key: 'bigbasket',
                    width: 100,
                    render: formatReward,
                    sorter: (a, b) => parseRewardValue(a.bigbasket) - parseRewardValue(b.bigbasket),
                },
                {
                    title: (
                        <Tooltip title="Flipkart Shopping Rewards">
                            <div className="platform-header">
                                <span className="platform-icon flipkart-icon">F</span>
                                <Text>Flipkart</Text>
                            </div>
                        </Tooltip>
                    ),
                    dataIndex: 'flipkart',
                    key: 'flipkart',
                    width: 100,
                    render: formatReward,
                    sorter: (a, b) => parseRewardValue(a.flipkart) - parseRewardValue(b.flipkart),
                },
                {
                    title: (
                        <Tooltip title="Myntra Fashion Rewards">
                            <div className="platform-header">
                                <span className="platform-icon myntra-icon">M</span>
                                <Text>Myntra</Text>
                            </div>
                        </Tooltip>
                    ),
                    dataIndex: 'myntra',
                    key: 'myntra',
                    width: 100,
                    render: formatReward,
                    sorter: (a, b) => parseRewardValue(a.myntra) - parseRewardValue(b.myntra),
                },
                {
                    title: (
                        <Tooltip title="Ola Ride Rewards">
                            <div className="platform-header">
                                <span className="platform-icon ola-icon">O</span>
                                <Text>Ola</Text>
                            </div>
                        </Tooltip>
                    ),
                    dataIndex: 'ola',
                    key: 'ola',
                    width: 80,
                    render: formatReward,
                    sorter: (a, b) => parseRewardValue(a.ola) - parseRewardValue(b.ola),
                },
                {
                    title: (
                        <Tooltip title="Swiggy Food Delivery Rewards">
                            <div className="platform-header">
                                <span className="platform-icon swiggy-icon">S</span>
                                <Text>Swiggy</Text>
                            </div>
                        </Tooltip>
                    ),
                    dataIndex: 'swiggy',
                    key: 'swiggy',
                    width: 100,
                    render: formatReward,
                    sorter: (a, b) => parseRewardValue(a.swiggy) - parseRewardValue(b.swiggy),
                },
                {
                    title: (
                        <Tooltip title="Rapido Ride Rewards">
                            <div className="platform-header">
                                <span className="platform-icon rapido-icon">R</span>
                                <Text>Rapido</Text>
                            </div>
                        </Tooltip>
                    ),
                    dataIndex: 'rapido',
                    key: 'rapido',
                    width: 100,
                    render: formatReward,
                    sorter: (a, b) => parseRewardValue(a.rapido) - parseRewardValue(b.rapido),
                },
                {
                    title: (
                        <Tooltip title="Uber Ride Rewards">
                            <div className="platform-header">
                                <span className="platform-icon uber-icon">U</span>
                                <Text>Uber</Text>
                            </div>
                        </Tooltip>
                    ),
                    dataIndex: 'uber',
                    key: 'uber',
                    width: 80,
                    render: formatReward,
                    sorter: (a, b) => parseRewardValue(a.uber) - parseRewardValue(b.uber),
                },
                {
                    title: (
                        <Tooltip title="Zomato Food Delivery Rewards">
                            <div className="platform-header">
                                <span className="platform-icon zomato-icon">Z</span>
                                <Text>Zomato</Text>
                            </div>
                        </Tooltip>
                    ),
                    dataIndex: 'zomato',
                    key: 'zomato',
                    width: 100,
                    render: formatReward,
                    sorter: (a, b) => parseRewardValue(a.zomato) - parseRewardValue(b.zomato),
                },
            ]
        },
        {
            title: (
                <Space>
                    <InfoCircleOutlined />
                    <Text strong>Additional Info</Text>
                </Space>
            ),
            dataIndex: 'comments',
            key: 'comments',
            width: 200, // Increased width slightly
            fixed: 'right',
            render: (text, record) => (
                <div className="comments-cell">
                    {text ? (
                        <div className="expandable-comment">
                            <div className="comment-content">
                                <Text
                                    className={`comments-text ${expandedComments.has(record.id) ? 'expanded' : 'collapsed'}`}
                                >
                                    {expandedComments.has(record.id) ? text :
                                        text.length > 30 ? `${text.substring(0, 30)}...` : text}
                                </Text>
                            </div>
                            {text.length > 60 && (
                                <Button
                                    type="text"
                                    size="small"
                                    className={`expand-toggle-btn ${expandedComments.has(record.id) ? 'expanded' : ''}`}
                                    icon={expandedComments.has(record.id) ?
                                        <UpOutlined className="toggle-icon" /> :
                                        <DownOutlined className="toggle-icon" />}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleCommentExpansion(record.id)
                                    }}
                                >
                                    {expandedComments.has(record.id) ? 'Collapse' : 'Expand'}
                                </Button>

                            )}
                        </div>
                    ) : (
                        <Text type="secondary" className="no-comments">No additional info</Text>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="platform-rewards-container">
            <Card className="table-card" bordered={false}>
                <Table
                    dataSource={data}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    className="modern-data-table"
                    bordered={false}
                    size="middle"
                    scroll={{ x: 1300, y: 410 }}
                    pagination={{
                        defaultPageSize: 15,
                        showSizeChanger: true,
                        pageSizeOptions: ['20', '25', '30', '50'],
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} credit cards`,
                        className: 'modern-pagination'
                    }}
                />
            </Card>
        </div>
    );
}
