import React, { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "../loginAuth/auth";
import { SearchOutlined } from "@ant-design/icons";
import "./Cards.css";

// Category config: icon + CSS class
const CATEGORY_CONFIG = {
    "PREMIUM": { icon: "💎", className: "premium" },
    "TRAVEL": { icon: "✈️", className: "travel" },
    "LOUNGE ACCESS": { icon: "🛋️", className: "lounge-access" },
    "SHOPPING": { icon: "🛍️", className: "shopping" },
    "DINING": { icon: "🍽️", className: "dining" },
    "FOOD DELIVERY": { icon: "🍕", className: "food-delivery" },
    "CASHBACK": { icon: "💰", className: "cashback" },
    "LIFESTYLE": { icon: "🌟", className: "lifestyle" },
    "TELECOM": { icon: "📱", className: "telecom" },
};

// Get bank-specific CSS class for card visual
const getBankClass = (issuer) => {
    if (!issuer) return "default-bank";
    const lower = issuer.toLowerCase();
    if (lower.includes("axis")) return "axis-bank";
    if (lower.includes("hdfc")) return "hdfc-bank";
    if (lower.includes("icici")) return "icici-bank";
    if (lower.includes("sbi") || lower.includes("state bank")) return "sbi";
    if (lower.includes("hsbc")) return "hsbc";
    return "default-bank";
};

// Parse categories from pipe-delimited string
const parseCategories = (categoriesStr) => {
    if (!categoriesStr) return [];
    return categoriesStr.split("|").map(c => c.trim()).filter(Boolean);
};

// Format fee display
const formatFee = (fee) => {
    if (!fee || fee === "0" || fee === 0) return { text: "FREE", isFree: true };
    return { text: `₹${fee} + GST`, isFree: false };
};

// Shimmer Loading Skeleton
function CardSkeleton() {
    return (
        <div className="card-tile-skeleton">
            <div className="skeleton-main">
                <div className="skeleton-image" />
                <div className="skeleton-info">
                    <div className="skeleton-tags">
                        <div className="skeleton-tag" />
                        <div className="skeleton-tag" />
                    </div>
                    <div className="skeleton-title" />
                    <div className="skeleton-subtitle" />
                </div>
                <div className="skeleton-actions">
                    <div className="skeleton-btn" />
                    <div className="skeleton-btn" />
                </div>
            </div>
            <div className="skeleton-bar">
                <div className="skeleton-bar-item" />
                <div className="skeleton-bar-item" />
                <div className="skeleton-bar-item" />
                <div className="skeleton-bar-item" />
                <div className="skeleton-bar-item" />
            </div>
        </div>
    );
}

// Card Visual (fake credit card image)
function CardVisual({ name, cardIssuer }) {
    const bankClass = getBankClass(cardIssuer);
    return (
        <div className={`card-visual ${bankClass}`}>
            <span className="card-visual-issuer">{cardIssuer || "Bank"}</span>
            <div className="card-visual-chip" />
            <span className="card-visual-name">{name}</span>
            <div className="card-visual-network">
                <div className="network-circles">
                    <div className="circle" />
                    <div className="circle" />
                </div>
            </div>
        </div>
    );
}

// Single Card Tile
function CardTile({ card }) {
    const [expanded, setExpanded] = useState(false);

    const categories = parseCategories(card.categories);
    const joiningFee = formatFee(card.joiningfee);
    const annualFee = formatFee(card.annualfee);

    // Safely extract string from DynamoDB {S: "value"} or plain string
    const safeStr = (val) => {
        if (!val) return "";
        if (typeof val === "string") return val;
        if (typeof val === "object" && val.S !== undefined) return val.S;
        if (typeof val === "object") return JSON.stringify(val);
        return String(val);
    };

    // Parse features list from DynamoDB format
    const parseFeatures = () => {
        try {
            if (!card.list || card.list === "[]") return [];
            const parsed = typeof card.list === "string" ? JSON.parse(card.list) : card.list;
            if (!Array.isArray(parsed)) return [];
            return parsed.map(item => {
                const m = item.M || item;
                return {
                    name: safeStr(m.featureName),
                    value: safeStr(m.featureValue),
                    capping: safeStr(m.rewardCapping),
                    remarks: safeStr(m.remarks),
                };
            });
        } catch {
            return [];
        }
    };

    const features = parseFeatures();

    // Platform reward data for expanded view
    const platforms = [
        { name: "Amazon", key: "amazon" },
        { name: "Flipkart", key: "flipkart" },
        { name: "Swiggy", key: "swiggy" },
        { name: "Zomato", key: "zomato" },
        { name: "Myntra", key: "myntra" },
        { name: "BigBasket", key: "bigbasket" },
        { name: "Ola", key: "ola" },
        { name: "Uber", key: "uber" },
        { name: "Rapido", key: "rapido" },
    ];

    return (
        <div className="card-tile" id={`card-tile-${card.id}`}>
            <div className="card-tile-main">
                {/* Card Image */}
                <div className="card-image-section">
                    <CardVisual name={card.name} cardIssuer={card.cardIssuer} />
                </div>

                {/* Card Info */}
                <div className="card-info-section">
                    <div className="card-categories">
                        {categories.map((cat, i) => {
                            const config = CATEGORY_CONFIG[cat] || { icon: "🏷️", className: "lifestyle" };
                            return (
                                <span key={i} className={`category-tag ${config.className}`}>
                                    <span className="tag-icon">{config.icon}</span>
                                    {cat}
                                    <span className="info-icon">ⓘ</span>
                                </span>
                            );
                        })}
                    </div>
                    <div>
                        <div className="card-name-title">{card.name} Credit Card</div>
                        <div className="card-issuer-subtitle">{card.cardIssuer}</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="card-actions-section">
                    <button
                        className="btn-read-more"
                        onClick={() => setExpanded(!expanded)}
                        id={`btn-readmore-${card.id}`}
                    >
                        {expanded ? "Show less" : "Read more"} <span className="arrow">{expanded ? "↑" : "→"}</span>
                    </button>
                    <button className="btn-ask-ai" id={`btn-askai-${card.id}`}>
                        Ask AI <span className="ai-sparkle">✨</span>
                    </button>
                    <span className="link-report">Report data issue</span>
                </div>
            </div>

            {/* Bottom Details Bar */}
            <div className="card-details-bar">
                <div className="detail-item">
                    <span className="detail-label">Intro Offer</span>
                    <span className="detail-value" title={card.introOffer || card.comments || "-"}>
                        {card.introOffer || card.comments || "-"}
                    </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Annual Fees</span>
                    <span className={`detail-value ${annualFee.isFree ? "free" : ""}`}>
                        {annualFee.text}
                    </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Joining Fees</span>
                    <span className={`detail-value ${joiningFee.isFree ? "free" : ""}`}>
                        {joiningFee.text}
                    </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Reward Rate</span>
                    <span className="detail-value">
                        {card.rewardRate || "-"}
                    </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Rating</span>
                    <span className="rating-value">
                        {card.rating || "-"} <span className="rating-star">★</span>
                    </span>
                </div>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="card-expanded-details">
                    {features.length > 0 && (
                        <>
                            <div className="expanded-title">✦ Special Features</div>
                            <div className="features-grid">
                                {features.map((feat, i) => (
                                    <div key={i} className="feature-item">
                                        <div className="feature-name">{feat.name}</div>
                                        <div className="feature-detail">
                                            <span className="feature-detail-label">Value</span>
                                            <span className="feature-detail-value">{feat.value}</span>
                                        </div>
                                        {feat.capping && (
                                            <div className="feature-detail">
                                                <span className="feature-detail-label">Capping</span>
                                                <span className="feature-detail-value">{feat.capping}</span>
                                            </div>
                                        )}
                                        {feat.remarks && (
                                            <div className="feature-detail">
                                                <span className="feature-detail-label">Remarks</span>
                                                <span className="feature-detail-value">{feat.remarks}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="expanded-title" style={{ marginTop: features.length > 0 ? 20 : 0 }}>
                        ✦ Platform Rewards Breakdown
                    </div>
                    <div className="platform-rewards-grid">
                        {platforms.map(p => {
                            const val = card[p.key];
                            const isNoReward = !val || val === "'-" || val === "0%" || val === "0";
                            return (
                                <div key={p.key} className="platform-reward-item">
                                    <div className="platform-reward-name">{p.name}</div>
                                    <div className={`platform-reward-value ${isNoReward ? "no-reward" : ""}`}>
                                        {isNoReward ? "-" : val}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {card.comments && (
                        <div style={{ marginTop: 16, color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                            <strong style={{ color: "rgba(255,255,255,0.55)" }}>Note:</strong> {card.comments}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Main Cards Component
export default function Cards() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const session = await getSession();
                const token = session.getIdToken().getJwtToken();
                const resp = await axios.get(
                    process.env.REACT_APP_BASE_URL + process.env.REACT_APP_CREDIT_CARD_DETAILS_GET,
                    { headers: { Authorization: token } }
                );
                setData(resp.data.items || []);
            } catch (err) {
                console.log("Cards fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // All unique categories from data
    const allCategories = [...new Set(
        data.flatMap(card => parseCategories(card.categories))
    )].sort();

    // Filter logic
    const filteredData = data.filter(card => {
        const matchesSearch =
            !searchQuery ||
            card.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.cardIssuer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.categories?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            activeFilter === "ALL" ||
            (card.categories && card.categories.includes(activeFilter));

        return matchesSearch && matchesFilter;
    });

    // Sort by rating descending
    const sortedData = [...filteredData].sort((a, b) => {
        const rA = parseFloat(a.rating) || 0;
        const rB = parseFloat(b.rating) || 0;
        return rB - rA;
    });

    return (
        <div className="cards-showcase-container" id="cards-showcase">
            {/* Header */}
            <div className="cards-showcase-header">
                <h1>Credit Card Explorer</h1>
                <p>
                    Discover and compare the best credit cards across top Indian banks.
                    Find your perfect financial match with detailed rewards, fees, and ratings.
                </p>
                <div className="cards-count-badge">
                    <span className="pulse-dot" />
                    {loading ? "Loading..." : `${sortedData.length} Cards Available`}
                </div>
            </div>

            {/* Search & Filter */}
            <div className="cards-filter-bar">
                <div className="cards-search-wrapper">
                    <SearchOutlined className="search-icon" />
                    <input
                        type="text"
                        className="cards-search-input"
                        placeholder="Search cards by name, bank, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        id="cards-search-input"
                    />
                </div>
                <button
                    className={`filter-chip ${activeFilter === "ALL" ? "active" : ""}`}
                    onClick={() => setActiveFilter("ALL")}
                >
                    All
                </button>
                {allCategories.map(cat => (
                    <button
                        key={cat}
                        className={`filter-chip ${activeFilter === cat ? "active" : ""}`}
                        onClick={() => setActiveFilter(activeFilter === cat ? "ALL" : cat)}
                    >
                        {CATEGORY_CONFIG[cat]?.icon || "🏷️"} {cat}
                    </button>
                ))}
            </div>

            {/* Cards Grid */}
            <div className="cards-grid">
                {loading ? (
                    <>
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </>
                ) : sortedData.length === 0 ? (
                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h3>No cards found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    sortedData.map(card => (
                        <CardTile key={card.id} card={card} />
                    ))
                )}
            </div>
        </div>
    );
}
