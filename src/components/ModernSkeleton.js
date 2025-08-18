import React from "react";
import "./modernSkeleton.css";

export default function ModernSkeleton({ mode = "page" }) {
	if (mode === "section") {
		return (
			<div className="ms-section" aria-busy="true" aria-live="polite">
				<div className="ms-shimmer ms-title" />
				<div className="ms-row">
					<div className="ms-card" />
					<div className="ms-card" />
					<div className="ms-card" />
				</div>
				<div className="ms-table">
					{Array.from({ length: 6 }).map((_, idx) => (
						<div className="ms-row-line" key={idx} />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="ms-page" aria-busy="true" aria-live="polite">
			<div className="ms-backdrop">
				<div className="ms-mesh ms-a" />
				<div className="ms-mesh ms-b" />
				<div className="ms-mesh ms-c" />
			</div>

			<div className="ms-header">
				<div className="ms-badge-group">
					<div className="ms-badge" />
					<div className="ms-badge" />
				</div>
				<div className="ms-avatar" />
				<div className="ms-title-group">
					<div className="ms-shimmer ms-title-lg" />
					<div className="ms-shimmer ms-subtitle" />
				</div>
				<div className="ms-stats">
					<div className="ms-stat" />
					<div className="ms-stat" />
					<div className="ms-stat" />
				</div>
			</div>

			<div className="ms-table-card">
				<div className="ms-table-head">
					<div className="ms-col" />
					<div className="ms-col" />
					<div className="ms-col" />
					<div className="ms-col" />
					<div className="ms-col" />
				</div>
				<div className="ms-table-body">
					{Array.from({ length: 9 }).map((_, idx) => (
						<div className="ms-row-line" key={idx} />
					))}
				</div>
			</div>
		</div>
	);
}


