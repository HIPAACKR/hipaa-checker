import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';

import arrowDownGray from '@/../public/images/icons/arrowDownGray.svg';

import Text from '../text';

import './index.scss';

const DropDown = ({title, data, type, placeholder, value, setValue, isFixedHeight = false, imgSrcAtLeft='', isDisabled = false}) => {
    const dropdownRef = useRef(null);
    const selectedOptionRef = useRef(null);
    const optionsWrapperRef = useRef(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [placeholderBG, setPlaceholderBG] = useState(type === 'colored' ? 'white' : null);
    const [openUpwards, setOpenUpwards] = useState(false);

    useEffect(() => {
        if (value !== undefined && value !== null) {
            if (!type) {
                setSelectedItem(value);  // Store the string
            } else {
                const foundItem = data?.find((item) => item?.id === value);
                if (foundItem) {
                    setSelectedItem(foundItem);  // Store the full object
                    if (type === 'colored') setPlaceholderBG(foundItem?.color);
                }
            }
        } else {
            setSelectedItem(null);
        }
    }, [value, data, type]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropDownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        if (dropDownOpen && selectedOptionRef.current) {
            selectedOptionRef.current.scrollIntoView({block: 'nearest', inline: 'nearest'});
        }
    }, [dropDownOpen]);

    // Auto-detect if dropdown should open upwards or downwards based on available space
    useEffect(() => {
        if (dropDownOpen && dropdownRef.current) {
            const dropdownElement = dropdownRef.current;
            const rect = dropdownElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate available space below and above
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            // Dropdown height (approximate max height)
            const dropdownHeight = isFixedHeight ? 160 : 300; // max-height from CSS

            // If not enough space below but more space above, open upwards
            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                setOpenUpwards(true);
            } else {
                setOpenUpwards(false);
            }
        }
    }, [dropDownOpen, isFixedHeight]);

    const getDisplayText = () => {
        if (!selectedItem) return placeholder ?? 'Select an option';
        if (type) return selectedItem?.name;  // For objects, show name
        return selectedItem;  // For strings, show the string
    };

    return (
        <div
            className="dropdown"
            ref={dropdownRef}
        >
            {title ? (
                <div
                    className="dropdown__title"
                    onClick={() => !isDisabled && setDropDownOpen(!dropDownOpen)}
                >
                    <Text
                        color="neutral-700"
                        size="fs-16"
                        weight="bold"
                    >
                        Organization
                    </Text>
                </div>
            ) : (
                <></>
            )}

            <div className="dropdown__content">
                <div
                    className={
                        `dropdown__placeHolder ${dropDownOpen ? 'dropdown__placeHolder--focus' : ''}
                        ${placeholderBG ? `dropdown__placeHolder--colored dropdown__PlaceHolder--${placeholderBG}` : ''}
                        ${isDisabled ? 'dropdown__placeHolder--disabled' : ''}`
                    }
                    onClick={() => !isDisabled && setDropDownOpen(!dropDownOpen)}
                >
                    {imgSrcAtLeft ? (
                        <Image
                            className={`${dropDownOpen ? 'dropdown__dropDown--open' : ''}`}
                            src={imgSrcAtLeft}
                            width={type === 'colored' ? 12 : 14}
                            height={type === 'colored' ? 5 : 8}
                            alt="arrow-down"
                        />
                    ): ''}
                    <div className="dropdown__placeHolder__text-container">
                        <Text
                            size="fs-14"
                            color="neutral-800"
                            backgroundColor={placeholderBG}
                        >
                            {getDisplayText()}
                        </Text>
                        {/* add explanation if it exists */}
                        {type && selectedItem?.explanation && (
                            <Text
                                size="fs-12"
                                color="neutral-600"
                                className="mt-0.5 leading-tight block break-words whitespace-normal max-w-full overflow-visible"
                                style={{
                                    textOverflow: 'clip',
                                    whiteSpace: 'normal',
                                    overflow: 'visible'
                                }}
                            >
                                {selectedItem.explanation}
                            </Text>
                        )}
                    </div>
                    <Image
                        className={`${dropDownOpen ? 'dropdown__dropDown--open' : ''}`}
                        src={arrowDownGray.src}
                        width={type === 'colored' ? 12 : 14}
                        height={type === 'colored' ? 5 : 8}
                        alt="arrow-down"
                    />
                </div>
                {dropDownOpen && (
                    <div
                        ref={optionsWrapperRef}
                        className={`dropdown__optionsWrapper ${isFixedHeight ? 'dropdown__optionsWrapper--scrollable' : ''} ${openUpwards ? 'dropdown__optionsWrapper--upwards' : ''}`}
                    >
                        {data &&
                            data?.map((item, index) => {
                                const isActive = type 
                                    ? selectedItem?.id === item?.id 
                                    : selectedItem === item;

                                return (
                                    <div
                                        ref={isActive ? selectedOptionRef : null}
                                        key={index}
                                        className={`dropdown__option ${isActive ? 'dropdown__option--active' : ''}`}
                                        onClick={() => {
                                            setDropDownOpen(false);
                                            setSelectedItem(item);
                                            setPlaceholderBG(item.color ?? null);
                                            if (setValue) setValue(item.id ?? item);
                                        }}
                                    >
                                        <Text
                                            size="fs-14"
                                            color="neutral-800"
                                        >
                                            {type ? item.name : item}
                                        </Text>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DropDown;
