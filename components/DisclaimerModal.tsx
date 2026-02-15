"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./DisclaimerModal.module.css";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";

interface DisclaimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLang: string;
}

export default function DisclaimerModal({ isOpen, onClose, currentLang }: DisclaimerModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    // const searchParams = useSearchParams();
    // const lang = searchParams.get("lang") || "en";
    const lang = currentLang;

    const content = {
        en: {
            title: "Our Mission",
            p1: "We believe news should be fast, fair, and focused. nQws streamlines your daily briefing by delivering unbiased content in a refined, minimalist format.",
            p2: "Your data is not our business. We’ve built an environment free from cookies and tracking, so you can focus on what matters: the facts."
        },
        it: {
            title: "La nostra missione",
            p1: "Crediamo che l'informazione debba essere rapida, equa e focalizzata. nQws ottimizza i tuoi aggiornamenti quotidiani offrendo contenuti imparziali in un formato raffinato e minimale.",
            p2: "I tuoi dati non sono affare nostro. Abbiamo creato un ambiente libero da cookie e tracciamenti, così puoi concentrarti solo su ciò che conta: i fatti."
        }
    };


    const t = lang === 'it' ? content.it : content.en;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on Escape & click outside
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!mounted) return null;
    if (!isOpen) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose} aria-modal="true" role="dialog">
            <div
                className={styles.modal}
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2 className={styles.title}>{t.title}</h2>
                    <button onClick={onClose} className={styles.closeButton} aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className={styles.content}>
                    <p>
                        {t.p1}
                    </p>
                    <p>
                        {t.p2}
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}
