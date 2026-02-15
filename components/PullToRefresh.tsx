"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./PullToRefresh.module.css";

interface PullToRefreshProps {
    children: React.ReactNode;
}

export default function PullToRefresh({ children }: PullToRefreshProps) {
    const router = useRouter();
    const [startY, setStartY] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const threshold = 120; // px to drag to trigger refresh
    const maxDrag = 200; // max visual drag

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                setStartY(e.touches[0].clientY);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            const y = e.touches[0].clientY;
            const diff = y - startY;

            // Only allow pulling if we started at the top and are pulling down
            if (window.scrollY === 0 && diff > 0 && !isRefreshing) {
                // Add resistance
                const newY = Math.min(diff * 0.5, maxDrag);
                setCurrentY(newY);

                // Prevent default scrolling if we are acting as pull-to-refresh
                if (diff < maxDrag) {
                    // e.preventDefault(); // Be careful with this, might block normal scroll
                }
            }
        };

        const handleTouchEnd = () => {
            if (currentY > 60 && !isRefreshing) { // 60px visual threshold to trigger
                triggerRefresh();
            } else {
                setCurrentY(0);
            }
        };

        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchmove", handleTouchMove, { passive: false }); // non-passive to allow preventDefault if needed
        container.addEventListener("touchend", handleTouchEnd);

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
        };
    }, [startY, currentY, isRefreshing]);

    const triggerRefresh = async () => {
        setIsRefreshing(true);
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(50);

        // Keep the indicator visible
        // setCurrentY(60); 

        // Trigger Next.js refresh
        router.refresh();

        // Wait a bit to show the spinner and ensure data re-fetch visual feedback
        setTimeout(() => {
            setIsRefreshing(false);
            setCurrentY(0);
            setStartY(0);
        }, 1500);
    };

    return (
        <div ref={containerRef} className={styles.container}>
            <div
                className={`${styles.indicator} ${currentY > 0 || isRefreshing ? styles.visible : ''}`}
                style={{
                    transform: `translateY(${isRefreshing ? 60 : currentY}px) translateY(-100%)`
                }}
            >
                {isRefreshing ? (
                    <div className={styles.spinner} />
                ) : (
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`${styles.icon} ${currentY > threshold * 0.5 ? styles.rotate : ''}`}
                        style={{ transform: `rotate(${currentY * 2}deg)` }}
                    >
                        <path d="M23 4v6h-6" />
                        <path d="M1 20v-6h6" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                )}
            </div>
            <div style={{
                transform: `translateY(${isRefreshing ? 60 : currentY}px)`,
                transition: isRefreshing || currentY === 0 ? 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
            }}>
                {children}
            </div>
        </div>
    );
}
