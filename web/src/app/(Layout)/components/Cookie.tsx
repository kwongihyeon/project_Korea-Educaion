'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';

const SetCookie = () => {
  useEffect(() => {
    const currentLanguage = Cookies.get('language');
    console.log(currentLanguage)
    if (!currentLanguage) {
      Cookies.set('language', 'english', {
        expires: 30, // 30일 동안 유지
        path: '/', // 모든 경로
      });
    }
  }, []);

  return null; 
};

export default SetCookie