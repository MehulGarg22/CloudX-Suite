import React, { useState, useEffect } from "react"
import axios from 'axios';
import { Table, Card, Typography, Space, Tag, Tooltip, Skeleton, Row, Col, Statistic, Badge, Avatar, Button } from 'antd';
import { CreditCardOutlined, BankOutlined, GiftOutlined, InfoCircleOutlined, TrophyOutlined, PercentageOutlined, DollarOutlined, StarOutlined, ThunderboltOutlined, RocketOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import './creditCardPlatformRewards.css';
import Footer from "../footer/footer";
import ModernSkeleton from "../ModernSkeleton";
import GeneralCardComparisonTable from "./generalCardComparisonTable";
import { getSession } from "../loginAuth/auth";

const { Title, Text } = Typography;

export default function PlatformRewards() {
    const [data, setData] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
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
            }
        };
        fetchData();
    }, [])

    // Calculate stats for header
    const getHeaderStats = () => {
        if (!data) return { totalCards: 0, freeFeeCards: 0, topReward: '0%' };

        const totalCards = data.length;
        const freeFeeCards = data.filter(card =>
            (!card.annualfee || card.annualfee === '0') &&
            (!card.joiningfee || card.joiningfee === '0')
        ).length;

        let maxReward = 0;
        data.forEach(card => {
            ['amazon', 'flipkart', 'swiggy', 'zomato', 'myntra', 'bigbasket', 'ola', 'uber', 'rapido'].forEach(platform => {
                if (card[platform]) {
                    const reward = parseFloat(card[platform].replace('%', '')) || 0;
                    maxReward = Math.max(maxReward, reward);
                }
            });
        });

        return { totalCards, freeFeeCards, topReward: `${maxReward}%` };
    };

    const stats = getHeaderStats();

    return (
        <div className="platform-rewards-container">
            {/* MODERNIZED HEADER - ONLY THIS SECTION CHANGED */}
            <Card className="ultra-modern-header-card" bordered={false}>
                <div className="mesh-background">
                    <div className="mesh-gradient mesh-1"></div>
                    <div className="mesh-gradient mesh-2"></div>
                    <div className="mesh-gradient mesh-3"></div>
                </div>

                <div className="floating-particles">
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                    <div className="particle particle-4"></div>
                    <div className="particle particle-5"></div>
                </div>

                <div className="header-content-container">
                    <div className="header-top-section">
                        <div className="status-indicators">
                            <Badge dot className="live-indicator">
                                <Tag className="live-tag">
                                    <ThunderboltOutlined /> Live Data
                                </Tag>
                            </Badge>
                            <Tag className="ai-powered-tag">
                                <RocketOutlined /> AI Powered
                            </Tag>
                        </div>
                    </div>

                    <div className="hero-section">
                        <div className="icon-container">
                            <Avatar
                                size={80}
                                className="main-avatar"
                                icon={<CreditCardOutlined />}
                            />
                            <div className="pulse-rings">
                                <div className="pulse-ring ring-1"></div>
                                <div className="pulse-ring ring-2"></div>
                                <div className="pulse-ring ring-3"></div>
                            </div>
                        </div>

                        <div className="title-container">
                            <Title level={1} className="ultra-modern-title">
                                Smart Credit Card
                                <br />
                                <span className="gradient-text">Rewards Analytics</span>
                            </Title>

                            <div className="subtitle-container">
                                <Text className="modern-subtitle">
                                    Powered by advanced algorithms to find your
                                    <span className="highlight-span"> perfect financial match</span>
                                </Text>
                            </div>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <Row gutter={[20, 10]} justify="center">
                            <Col xs={24} sm={8}>
                                <div className="glass-stat-card primary-card">
                                    <div className="stat-icon-wrapper primary-icon">
                                        <CreditCardOutlined />
                                    </div>
                                    <Statistic
                                        title="Total Cards Analyzed"
                                        value={stats.totalCards}
                                        valueStyle={{
                                            background: 'linear-gradient(135deg, #DA5B9B, #6B96F4)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontSize: '25px',
                                            fontWeight: '800'
                                        }}
                                    />
                                    <div className="stat-sparkle">✨</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={8}>
                                <div className="glass-stat-card success-card">
                                    <div className="stat-icon-wrapper success-icon">
                                        <StarOutlined />
                                    </div>
                                    <Statistic
                                        title="Zero-Fee Options"
                                        value={stats.freeFeeCards}
                                        valueStyle={{
                                            background: 'linear-gradient(135deg, #06D6A0, #00D4AA)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontSize: '25px',
                                            fontWeight: '800'
                                        }}
                                    />
                                    <div className="stat-sparkle">💎</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={8}>
                                <div className="glass-stat-card accent-card">
                                    <div className="stat-icon-wrapper accent-icon">
                                        <TrophyOutlined />
                                    </div>
                                    <Statistic
                                        title="Peak Reward Rate"
                                        value={stats.topReward}
                                        valueStyle={{
                                            background: 'linear-gradient(135deg, #00D4AA, #FFD23F)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontSize: '25px',
                                            fontWeight: '800'
                                        }}
                                    />
                                    <div className="stat-sparkle">🚀</div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="features-showcase">
                        <div className="feature-badge-container">
                            <Tag className="modern-feature-badge shopping">
                                <GiftOutlined /> Smart Shopping Analysis
                            </Tag>
                            <Tag className="modern-feature-badge insights">
                                <InfoCircleOutlined /> Real-time Insights
                            </Tag>
                            <Tag className="modern-feature-badge rewards">
                                <PercentageOutlined /> Reward Maximization
                            </Tag>
                        </div>
                    </div>
                </div>
            </Card>
            <br />
            <br />
        </div>
    );
}
