//무한스크롤이나 요소가 화면에 보일 때 트리거되는 동작 커스텀 훅

import { useEffect, useRef, useState } from "react";

export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);

        if(targetRef.current) { 
            observer.observe(targetRef.current);
        }
        //컴포넌트 언마운트, 옵션 바뀌면 observer.disconnet() 감시종료
        return () => observer.disconnect();
    }, [options]);

    return { targetRef, isIntersecting };
}