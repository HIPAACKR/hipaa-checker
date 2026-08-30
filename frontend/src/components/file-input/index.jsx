'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import fileUploadIcon from '@/../public/images/icons/fileUpload.svg';

import Text from '../text';

import './index.scss';

const FileInput = ({ setValue, setClear }) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  useEffect(() => {
    if (setValue && file) setValue(file);
  }, [file, setValue]);
  useEffect(() => {
    if (setClear) {
      setFile(null);
      fileRef.current.value = null;
    }
  }, [setClear]);

  return (
    <div className='fileInput'>
      <div className='fileInput__wrapper'>
        <div className='fileInput__content'>
          <Image
            src={fileUploadIcon.src}
            alt='file-upload-icon'
            width={19}
            height={24}
          />
          <Text
            size='fs-14'
            color='primary-800'
            weight='medium'
          >
            Choose a file or drag and drop in here
          </Text>
        </div>
        <input
          ref={fileRef}
          type='file'
          title=''
          className='fileInput__input'
          accept='.apk, .zip'
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
      </div>
      <div className='fileInput__note'>
        <Text
          size='fs-12'
          color='neutral-400'
        >
          Supported file formats are .zip and .apk
        </Text>
      </div>
    </div>
  );
};

export default FileInput;
