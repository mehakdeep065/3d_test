import { useEffect, useRef, useState, useCallback } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const mouse = useRef({ x: -100, y: -100 });
    const pos = useRef({ x: -100, y: -100 });
    const rafId = useRef(0);

    const animate = useCallback(() => {
        // Fast lerp — snappy tracking
        pos.current.x += (mouse.current.x - pos.current.x) * 0.5;
        pos.current.y += (mouse.current.y - pos.current.y) * 0.5;

        if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
        }

        rafId.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        // Hide on mobile
        if (window.innerWidth < 768) return;

        // Respect reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        setIsVisible(true);
        document.body.classList.add('has-custom-cursor');

        const onMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button, [role="button"], .polaroid-card')) {
                setIsHovering(true);
            }
        };

        const onMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button, [role="button"], .polaroid-card')) {
                setIsHovering(false);
            }
        };

        const onMouseLeave = () => {
            mouse.current = { x: -100, y: -100 };
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseover', onMouseOver, { passive: true });
        document.addEventListener('mouseout', onMouseOut, { passive: true });
        document.addEventListener('mouseleave', onMouseLeave);
        rafId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseout', onMouseOut);
            document.removeEventListener('mouseleave', onMouseLeave);
            cancelAnimationFrame(rafId.current);
            document.body.classList.remove('has-custom-cursor');
        };
    }, [animate]);

    if (!isVisible) return null;

    const size = isHovering ? 32 : 8;
    const offset = size / -2;

    return (
        <div
            ref={cursorRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                background: isHovering ? 'transparent' : '#FAFAFA',
                border: isHovering ? '1px solid #FAFAFA' : 'none',
                pointerEvents: 'none',
                zIndex: 9999,
                mixBlendMode: 'difference',
                marginLeft: `${offset}px`,
                marginTop: `${offset}px`,
                transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, border 0.3s, margin 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform',
            }}
        />
    );
}
