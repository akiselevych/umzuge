//libs
import React, { useCallback, useEffect, useRef, useState } from "react";
//hooks
import { useDebounce } from "hooks/useDebounce";
//types
import { MultiRangeSliderProps } from "types";
//styles
import "components/MultiRangeSlider/MultiRangeSlider.scss";
import { ca } from "date-fns/locale";

const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({
    min,
    max,
    onChange,
    maxDiffer,
    dateFormat
}) => {
    const [minVal, setMinVal] = useState<number>(min);
    const [maxVal, setMaxVal] = useState<number>(max);
    const debouncedMinValue = useDebounce<number>(minVal, 100);
    const debouncedMaxValue = useDebounce<number>(maxVal, 100);

    const minValRef = useRef<number>(min);
    const maxValRef = useRef<number>(max);
    const range = useRef<HTMLDivElement>(null);

    const [maxDifferVal, setMaxDifferVal] = useState<number | undefined>(maxDiffer);
    // ...
    useEffect(() => {
        minValRef.current = min;
        maxValRef.current = max;
        setMinVal(min);
        setMaxDifferVal(maxDiffer);
    }, [min, max, maxDiffer]);


    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
        // eslint-disable-next-line
    }, [debouncedMaxValue, debouncedMinValue, onChange]);

    // Оновлення максимального значення `maxVal` залежно від `maxDifferVal`
    useEffect(() => {
        if (maxDifferVal !== undefined) {
            setMaxVal(Math.min(maxVal, minVal + maxDifferVal));
            maxValRef.current = Math.min(maxVal, minVal + maxDifferVal);
        }
        // eslint-disable-next-line
    }, [maxDifferVal, minVal]);

    useEffect(() => {
        if (maxDifferVal !== undefined) {
            setMinVal(Math.max(minVal, maxVal - maxDifferVal));
            minValRef.current = Math.max(minVal, maxVal - maxDifferVal);
        }
        // eslint-disable-next-line
    }, [maxDifferVal, maxVal]);


    // Convert to percentage
    const getPercent = useCallback(
        (value: number) => {
            return Math.round(((value - min) / (max - min)) * 100);
        },
        [min, max]
    );

    useEffect(() => {
        minValRef.current = min;
        maxValRef.current = max;
        setMinVal(min);
    }, [min, max]);

    // Set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
        // eslint-disable-next-line
    }, [debouncedMaxValue, debouncedMinValue, onChange]);

    const formattedDate: (value: number) => string = (value) => {
        if (!value) return "00.00.0000";
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        switch (dateFormat) {
            case "Year":
                return year.toString()
            case "Month-Year":
                return `${month}.${year}`;
            case "Day-Month-Year":
                return `${day}.${month}.${year}`;
            default:
                return `${day}.${month}.${year}`;
        }
    };

    return (
        <div className="container">
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(event) => {
                    const value = Math.min(
                        Number(event.target.value),
                        maxVal - 1
                    );
                    setMinVal(value);
                    minValRef.current = value;
                }}
                className="thumb thumb--left"
                style={{ zIndex: minVal > max - 100 ? 5 : undefined }}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                onChange={(event) => {
                    const value = Math.max(
                        Number(event.target.value),
                        minVal + 1
                    );
                    setMaxVal(value);
                    maxValRef.current = value;
                }}
                className="thumb thumb--right"
            />

            <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
                <div className="slider__left-value">
                    {formattedDate(minVal)}
                </div>
                <div className="slider__right-value">
                    {maxVal === max ? "Jetzt" : formattedDate(maxVal)}
                </div>
            </div>
        </div>
    );
};

export default MultiRangeSlider;
